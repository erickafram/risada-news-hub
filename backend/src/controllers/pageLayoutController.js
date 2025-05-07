const PageLayout = require('../models/PageLayout');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

exports.getLayouts = async (req, res) => {
  try {
    const layouts = await PageLayout.findAll({
      order: [['created_at', 'DESC']]
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
    res.json(layout || {});
  } catch (error) {
    console.error('Erro ao buscar layout ativo:', error);
    res.status(500).json({ error: 'Erro ao buscar layout ativo' });
  }
};

exports.createLayout = async (req, res) => {
  try {
    const { name, layout } = req.body;
    
    // Desativar layout atual
    await PageLayout.update(
      { isActive: false },
      { where: { isActive: true } }
    );

    const newLayout = await PageLayout.create({
      name,
      layout,
      isActive: true,
      createdBy: req.user.id
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

    if (isActive) {
      // Desativar outros layouts
      await PageLayout.update(
        { isActive: false },
        { where: { isActive: true } }
      );
    }

    const updatedLayout = await PageLayout.update(
      { name, layout, isActive, updatedBy: req.user.id },
      { where: { id }, returning: true }
    );

    res.json(updatedLayout[1][0]);
  } catch (error) {
    console.error('Erro ao atualizar layout:', error);
    res.status(500).json({ error: 'Erro ao atualizar layout' });
  }
};

exports.deleteLayout = async (req, res) => {
  try {
    const { id } = req.params;
    await PageLayout.destroy({ where: { id } });
    res.json({ message: 'Layout deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar layout:', error);
    res.status(500).json({ error: 'Erro ao deletar layout' });
  }
};
