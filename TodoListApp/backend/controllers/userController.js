// controllers/userController.js
export const getSettings = (req, res) => {
  // Aqui você pode usar req.userId se estiver usando JWT
  // Exemplo de dados de configuração simulados
  res.json({
    theme: "dark",
    notifications: true,
    language: "pt-BR"
  });
};
