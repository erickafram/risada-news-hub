require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function main() {
  let connection;
  
  try {
    console.log('Iniciando verificação da rota page-layouts...');
    
    // Verificar se o arquivo do modelo PageLayout existe
    const modelPath = path.join(__dirname, 'src', 'models', 'PageLayout.js');
    if (!fs.existsSync(modelPath)) {
      console.log('Arquivo de modelo PageLayout não encontrado. Criando arquivo...');
      
      const modelContent = `const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PageLayout = sequelize.define('PageLayout', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  layout: {
    type: DataTypes.JSON,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_active'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'created_by'
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'updated_by'
  }
}, {
  tableName: 'page_layouts',
  timestamps: true,
  underscored: true
});

module.exports = PageLayout;`;

      fs.writeFileSync(modelPath, modelContent);
      console.log('Modelo PageLayout criado com sucesso.');
    } else {
      console.log('Modelo PageLayout já existe.');
    }
    
    // Verificar se o arquivo do controlador PageLayoutController existe
    const controllerPath = path.join(__dirname, 'src', 'controllers', 'pageLayoutController.js');
    if (!fs.existsSync(controllerPath)) {
      console.log('Arquivo de controlador PageLayoutController não encontrado. Criando arquivo...');
      
      const controllerContent = `const { PageLayout } = require('../models');

exports.getLayouts = async (req, res) => {
  try {
    const layouts = await PageLayout.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(layouts);
  } catch (error) {
    console.error('Erro ao buscar layouts:', error);
    res.status(500).json({ error: 'Erro ao buscar layouts' });
  }
};

exports.getActiveLayout = async (req, res) => {
  try {
    const layout = await PageLayout.findOne({
      where: { isActive: true }
    });
    
    if (!layout) {
      // Retornar um layout vazio se não existir um ativo
      return res.json({ layout: [] });
    }
    
    res.json(layout);
  } catch (error) {
    console.error('Erro ao buscar layout ativo:', error);
    res.status(500).json({ error: 'Erro ao buscar layout ativo' });
  }
};

exports.createLayout = async (req, res) => {
  try {
    const { name, layout } = req.body;
    
    if (!name || !layout) {
      return res.status(400).json({ error: 'Nome e layout são obrigatórios' });
    }
    
    // Desativar layout atual se o novo for definido como ativo
    const isActive = req.body.isActive === undefined ? true : req.body.isActive;
    
    if (isActive) {
      await PageLayout.update(
        { isActive: false },
        { where: { isActive: true } }
      );
    }

    const newLayout = await PageLayout.create({
      name,
      layout,
      isActive,
      createdBy: req.user?.id
    });

    res.status(201).json(newLayout);
  } catch (error) {
    console.error('Erro ao criar layout:', error);
    res.status(500).json({ error: 'Erro ao criar layout' });
  }
};

exports.updateLayout = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, layout, isActive } = req.body;

    const layoutToUpdate = await PageLayout.findByPk(id);
    if (!layoutToUpdate) {
      return res.status(404).json({ error: 'Layout não encontrado' });
    }

    if (isActive) {
      // Desativar outros layouts
      await PageLayout.update(
        { isActive: false },
        { where: { isActive: true, id: { [Op.ne]: id } } }
      );
    }

    await layoutToUpdate.update({
      name,
      layout,
      isActive,
      updatedBy: req.user?.id
    });

    res.json(layoutToUpdate);
  } catch (error) {
    console.error('Erro ao atualizar layout:', error);
    res.status(500).json({ error: 'Erro ao atualizar layout' });
  }
};

exports.deleteLayout = async (req, res) => {
  try {
    const { id } = req.params;
    const layout = await PageLayout.findByPk(id);
    
    if (!layout) {
      return res.status(404).json({ error: 'Layout não encontrado' });
    }
    
    await layout.destroy();
    res.json({ message: 'Layout deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar layout:', error);
    res.status(500).json({ error: 'Erro ao deletar layout' });
  }
};`;

      fs.writeFileSync(controllerPath, controllerContent);
      console.log('Controlador PageLayoutController criado com sucesso.');
    } else {
      console.log('Controlador PageLayoutController já existe.');
    }
    
    // Verificar se o arquivo de rotas pageLayoutRoutes existe
    const routesPath = path.join(__dirname, 'src', 'routes', 'pageLayoutRoutes.js');
    if (!fs.existsSync(routesPath)) {
      console.log('Arquivo de rotas pageLayoutRoutes não encontrado. Criando arquivo...');
      
      const routesContent = `const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const pageLayoutController = require('../controllers/pageLayoutController');

// Rota para listar todos os layouts
router.get('/', verifyToken, isAdmin, pageLayoutController.getLayouts);

// Rota para obter layout ativo - acessível publicamente
router.get('/active', pageLayoutController.getActiveLayout);

// Rota para criar novo layout
router.post('/', verifyToken, isAdmin, pageLayoutController.createLayout);

// Rota para atualizar layout
router.put('/:id', verifyToken, isAdmin, pageLayoutController.updateLayout);

// Rota para deletar layout
router.delete('/:id', verifyToken, isAdmin, pageLayoutController.deleteLayout);

module.exports = router;`;

      fs.writeFileSync(routesPath, routesContent);
      console.log('Arquivo de rotas pageLayoutRoutes criado com sucesso.');
    } else {
      console.log('Arquivo de rotas pageLayoutRoutes já existe.');
      
      // Verificar se a rota /active está sem middleware de autenticação
      const routesContent = fs.readFileSync(routesPath, 'utf8');
      if (routesContent.includes('router.get(\'/active\', verifyToken, isAdmin,')) {
        console.log('Atualizando rota /active para remover middleware de autenticação...');
        const updatedContent = routesContent.replace(
          'router.get(\'/active\', verifyToken, isAdmin,', 
          'router.get(\'/active\','
        );
        fs.writeFileSync(routesPath, updatedContent);
        console.log('Rota /active atualizada com sucesso.');
      } else {
        console.log('Rota /active já está configurada corretamente.');
      }
    }
    
    // Verificar se o modelo está importado corretamente no server.js
    const serverPath = path.join(__dirname, 'src', 'server.js');
    if (fs.existsSync(serverPath)) {
      let serverContent = fs.readFileSync(serverPath, 'utf8');
      
      // Verificar se a rota já está em uso
      if (!serverContent.includes('app.use(\'/api/page-layouts\'')) {
        console.log('Rota page-layouts não está configurada no server.js. Adicionando...');
        
        // Verificar se o pageLayoutRoutes já está sendo importado
        if (!serverContent.includes('pageLayoutRoutes')) {
          serverContent = serverContent.replace(
            '// Importação das rotas',
            '// Importação das rotas\nconst pageLayoutRoutes = require(\'./routes/pageLayoutRoutes\');'
          );
        }
        
        // Adicionar a rota
        const lastRouteLine = serverContent.lastIndexOf('app.use(\'/api/');
        let insertIndex = serverContent.indexOf('\n', lastRouteLine) + 1;
        
        if (insertIndex > 0) {
          const updatedContent = 
            serverContent.substring(0, insertIndex) + 
            'app.use(\'/api/page-layouts\', pageLayoutRoutes);\n' + 
            serverContent.substring(insertIndex);
          
          fs.writeFileSync(serverPath, updatedContent);
          console.log('Rota page-layouts adicionada ao server.js com sucesso.');
        } else {
          console.log('Não foi possível encontrar um local para adicionar a rota no server.js.');
        }
      } else {
        console.log('Rota page-layouts já está configurada no server.js.');
      }
    } else {
      console.log('Arquivo server.js não encontrado.');
    }
    
    // Verificar/criar a tabela no banco de dados
    console.log('Verificando a tabela page_layouts no banco de dados...');
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'risada_news_hub'
    };
    
    connection = await mysql.createConnection(dbConfig);
    
    // Verificar se a tabela existe
    const [tables] = await connection.query('SHOW TABLES LIKE "page_layouts"');
    
    if (tables.length === 0) {
      console.log('Tabela page_layouts não encontrada. Criando tabela...');
      
      await connection.query(`
        CREATE TABLE page_layouts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          layout JSON NOT NULL,
          is_active BOOLEAN NOT NULL DEFAULT FALSE,
          created_by INT,
          updated_by INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
          FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      
      console.log('Tabela page_layouts criada com sucesso!');
      
      // Criar layout padrão
      console.log('Criando layout padrão...');
      
      const defaultLayout = [
        {
          id: Math.random().toString(36).substring(2, 9),
          type: 'featured',
          settings: {
            title: 'Destaques',
            limit: 3
          }
        },
        {
          id: Math.random().toString(36).substring(2, 9),
          type: 'grid',
          settings: {
            title: 'Últimas Notícias',
            columns: 3,
            limit: 6
          }
        }
      ];
      
      await connection.query(`
        INSERT INTO page_layouts (name, layout, is_active, created_by)
        VALUES (
          'Layout Padrão', 
          ?, 
          TRUE, 
          (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
        );
      `, [JSON.stringify(defaultLayout)]);
      
      console.log('Layout padrão criado com sucesso!');
    } else {
      console.log('Tabela page_layouts já existe.');
    }
    
    console.log('Verificação concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a verificação:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main(); 