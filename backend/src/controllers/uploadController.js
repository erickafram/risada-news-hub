const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do armazenamento para o multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/images');
    
    // Garantir que o diretório existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Criar um nome de arquivo único com timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'image-' + uniqueSuffix + ext);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado. Apenas imagens JPEG, PNG, GIF e WebP são permitidas.'), false);
  }
};

// Configuração do multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Middleware para upload de imagem única
exports.uploadSingle = upload.single('image');

// Controlador para upload de imagem
exports.uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    }
    
    // Criar URL para a imagem
    // Usando o caminho relativo para garantir que funcione em qualquer ambiente
    const imageUrl = `/uploads/images/${req.file.filename}`;
    
    return res.status(200).json({
      message: 'Imagem enviada com sucesso',
      imageUrl,
      file: req.file
    });
  } catch (error) {
    console.error('Erro ao fazer upload de imagem:', error);
    return res.status(500).json({ message: 'Erro ao fazer upload de imagem' });
  }
};

// Middleware para tratamento de erros do multer
exports.handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Arquivo muito grande. O tamanho máximo é 5MB.' });
    }
    return res.status(400).json({ message: `Erro no upload: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};
