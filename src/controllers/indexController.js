const displayHome = async (req, res) => {
  res.status(200).json({ status: 'success', data: 'You are authenticated' });
};

module.exports = {
  displayHome,
};
