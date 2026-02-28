<?php
$dir = __DIR__;
$baseUrl = '/files/';
$files = array_diff(scandir($dir), ['.', '..', 'index.php', '.htaccess', '.htpasswd']);

$items = [];
foreach ($files as $file) {
    $path = $dir . '/' . $file;
    $items[] = [
        'name' => $file,
        'is_dir' => is_dir($path),
        'size' => is_file($path) ? filesize($path) : null,
        'modified' => filemtime($path),
    ];
}
usort($items, function($a, $b) {
    if ($a['is_dir'] !== $b['is_dir']) return $b['is_dir'] - $a['is_dir'];
    return strcasecmp($a['name'], $b['name']);
});

function formatSize($bytes) {
    if ($bytes >= 1073741824) return round($bytes / 1073741824, 2) . ' GB';
    if ($bytes >= 1048576) return round($bytes / 1048576, 2) . ' MB';
    if ($bytes >= 1024) return round($bytes / 1024, 2) . ' KB';
    return $bytes . ' B';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Files | DAconnect</title>
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet">
    <style>
        :root { --primary-color: #2d3748; --secondary-color: #e8833a; }
        body { font-family: 'Inter', sans-serif; background: #f8f9fa; }
        .file-table th { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; color: var(--primary-color); border-bottom: 2px solid var(--secondary-color); }
        .file-table td { vertical-align: middle; }
        .file-table tr:hover { background-color: rgba(232, 131, 58, 0.05); }
        .file-icon { color: var(--secondary-color); width: 24px; text-align: center; }
        .file-link { color: var(--primary-color); text-decoration: none; font-weight: 500; }
        .file-link:hover { color: var(--secondary-color); }
        .file-meta { color: #718096; font-size: 0.875rem; }
        .header-badge { font-weight: 500; letter-spacing: 1px; }
    </style>
</head>
<body>
    <section class="py-5" style="background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);">
        <div class="container py-4">
            <div class="text-center">
                <span class="badge bg-secondary bg-opacity-10 text-secondary px-4 py-2 mb-3 header-badge">SECURE FILES</span>
                <h1 class="fw-bold mb-3" style="color: var(--primary-color);">DAconnect Files</h1>
                <div style="width: 80px; height: 4px; background-color: var(--secondary-color); margin: 1.5rem auto 0; border-radius: 2px;"></div>
            </div>
        </div>
    </section>

    <section class="py-5">
        <div class="container" style="max-width: 900px;">
            <?php if (empty($items)): ?>
                <p class="text-muted text-center">No files available.</p>
            <?php else: ?>
                <table class="table file-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Size</th>
                            <th>Last Modified</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($items as $item): ?>
                        <tr>
                            <td>
                                <span class="file-icon me-2">
                                    <i class="fas <?= $item['is_dir'] ? 'fa-folder' : 'fa-file-zipper' ?>"></i>
                                </span>
                                <?php if ($item['is_dir']): ?>
                                    <a href="<?= htmlspecialchars($baseUrl . $item['name'] . '/') ?>" class="file-link"><?= htmlspecialchars($item['name']) ?></a>
                                <?php else: ?>
                                    <a href="<?= htmlspecialchars($baseUrl . $item['name']) ?>" class="file-link" download><?= htmlspecialchars($item['name']) ?></a>
                                <?php endif; ?>
                            </td>
                            <td class="file-meta"><?= $item['size'] !== null ? formatSize($item['size']) : '—' ?></td>
                            <td class="file-meta"><?= date('d M Y, g:i A', $item['modified']) ?></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
    </section>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
