import express from "express";

const loginRouter = express.Router();

loginRouter.get("/login", (req, res) => {
	res.render("login");
});

loginRouter.post("/login", (req, res) => {
	const { name } = req.body;
	req.session.username = name;
	res.redirect("/");
});

loginRouter.get("/logout", (req, res) => {
	console.log(req.session);
	const name = req.session.username;
	req.session.destroy((err) => {
		if (err) return res.redirect("/");
		res.render("logout", { name: name });
	});
});

export { loginRouter };
