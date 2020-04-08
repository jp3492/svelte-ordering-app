export const post = async (req, res) => {
  console.log("POSTING");

  res.end(JSON.stringify({ status: "success" }))
}

export const get = async (req, res) => {
  res.end(JSON.stringify({ items: [1, 2, 3] }))
}