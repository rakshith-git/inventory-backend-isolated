
const demo = async (req, res) => {
  return res.status(200).json({ message: "server running" });
};

export { demo };
