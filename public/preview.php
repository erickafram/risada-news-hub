<?php
// Configurações e funções de debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

function debug_log($message) {
    file_put_contents('debug_share.log', date('Y-m-d H:i:s') . " - {$message}\n", FILE_APPEND);
}

debug_log("Iniciando preview.php");

// Obter o ID do artigo da URL
$id = isset($_GET['id']) ? $_GET['id'] : '';

if (empty($id)) {
    debug_log("ID não fornecido, redirecionando para home");
    header('Location: /');
    exit;
}

debug_log("Buscando artigo com ID: {$id}");

// Buscar dados do artigo na API
$apiUrl = "https://memepmw.online/api/articles/{$id}";
$context = stream_context_create([
    'http' => [
        'timeout' => 30,
        'ignore_errors' => true
    ]
]);

$response = file_get_contents($apiUrl, false, $context);
debug_log("Resposta da API: " . substr($response, 0, 200) . "...");

$article = json_decode($response, true);

if (!$article) {
    debug_log("Artigo não encontrado ou erro na API");
    // Usar valores padrão
    $article = [
        'title' => 'Artigo | Meme PMW',
        'summary' => 'Leia este artigo no Meme PMW',
        'featured_image' => 'https://memepmw.online/assets/logo-36miSCX6.png',
        'createdAt' => date('Y-m-d H:i:s')
    ];
}

// Preparar dados para as meta tags
$title = htmlspecialchars($article['title'] ?? 'Artigo | Meme PMW');
$description = htmlspecialchars($article['summary'] ?? 'Leia este artigo no Meme PMW');

debug_log("Título do artigo: {$title}");
debug_log("Descrição do artigo: {$description}");

// Garantir que a URL da imagem seja absoluta
$imageUrl = $article['featured_image'] ?? 'https://memepmw.online/assets/logo-36miSCX6.png';
debug_log("URL da imagem original: {$imageUrl}");

if (strpos($imageUrl, 'http') !== 0) {
    if (strpos($imageUrl, '/') === 0) {
        $imageUrl = "https://memepmw.online{$imageUrl}";
    } else {
        $imageUrl = "https://memepmw.online/{$imageUrl}";
    }
}
if (strpos($imageUrl, '167.172.152.174:3001') !== false) {
    $imageUrl = str_replace('http://167.172.152.174:3001', 'https://memepmw.online', $imageUrl);
}

debug_log("URL da imagem corrigida: {$imageUrl}");

// Verificar se a imagem existe
$headers = @get_headers($imageUrl);
if (!$headers || strpos($headers[0], '200') === false) {
    debug_log("Imagem não encontrada, usando imagem padrão");
    $imageUrl = 'https://memepmw.online/assets/logo-36miSCX6.png';
}

// Criar slug para URL amigável
$date = new DateTime($article['createdAt'] ?? 'now');
$formattedDate = $date->format('Y-m-d');

function createSlug($text) {
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
    $text = preg_replace('~[^-\w]+~', '', $text);
    $text = trim($text, '-');
    $text = preg_replace('~-+~', '-', $text);
    $text = strtolower($text);
    return substr($text, 0, 100);
}

$slug = createSlug($title);
$articleUrl = "https://memepmw.online/article/{$slug}-{$formattedDate}-{$id}";
?>
<!DOCTYPE html>
<html lang="pt-BR" prefix="og: http://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $title; ?> | Meme PMW</title>
    <meta name="description" content="<?php echo $description; ?>">
    
    <!-- Meta tags OpenGraph para Facebook, WhatsApp -->
    <meta property="og:title" content="<?php echo $title; ?>">
    <meta property="og:description" content="<?php echo $description; ?>">
    <meta property="og:image" content="<?php echo $imageUrl; ?>">
    <meta property="og:image:secure_url" content="<?php echo $imageUrl; ?>">
    <meta property="og:url" content="<?php echo $articleUrl; ?>">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Meme PMW">
    <meta property="og:locale" content="pt_BR">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="<?php echo $title; ?>">
    
    <!-- Meta tags específicas para WhatsApp -->
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:determiner" content="the">
    
    <!-- Twitter Card tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@memepmw">
    <meta name="twitter:title" content="<?php echo $title; ?>">
    <meta name="twitter:description" content="<?php echo $description; ?>">
    <meta name="twitter:image" content="<?php echo $imageUrl; ?>">
    
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            margin: 20px;
        }
        .article-image {
            width: 100%;
            max-height: 400px;
            object-fit: contain;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
        }
        p {
            color: #666;
            line-height: 1.6;
        }
        .button {
            display: inline-block;
            background-color: #6d28d9;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            margin-top: 20px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="<?php echo $imageUrl; ?>" alt="<?php echo $title; ?>" class="article-image">
        <h1><?php echo $title; ?></h1>
        <p><?php echo $description; ?></p>
        <a href="<?php echo $articleUrl; ?>" class="button">Ler artigo completo</a>
    </div>
    
    <script>
        // Não redirecionamos automaticamente para dar tempo ao WhatsApp de fazer o scraping
        // O usuário pode clicar no botão para ler o artigo completo
        console.log('Preview carregado com sucesso');
        console.log('URL do artigo: <?php echo $articleUrl; ?>');
        console.log('Imagem: <?php echo $imageUrl; ?>');
    </script>
</body>
</html>
