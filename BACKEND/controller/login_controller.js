import pool from '../db.js';

export const login = (req, res) => {
    const { em, pa } = req.body;

    if (!em || !pa) {
        return res.status(400).send("Please enter a valid email or password");
    }

    pool.getConnection((err, connection) => {
        if (err) return res.status(500).send("Something went wrong");

        const q = "SELECT user_id, name, phone, role, password FROM users WHERE email = ?";
        connection.query(q, [em], (err, result) => {
            connection.release();
            if (err) return res.status(500).send("Something went wrong");

            if (result.length === 0) {
                return res.status(404).send("No user found");
            }

            const user = result[0];

            if (user.password === pa) {
                return res.status(200).json({
                    message: "Login Successful",
                    user_id: user.user_id,
                    role: user.role
                });
            } else {
                return res.status(400).send("Wrong email or password");
            }
        });
    });
};


export const register = (req, res) => {
    const { nm, ema, phn, pass } = req.body;

    if (!nm || !ema || !phn || !pass) {
        return res.status(400).send("Please enter all the informations properly...");
    } else {
        if (pass.length <= 5) {
            return res
                .status(400)
                .send("Your password must be at least 5 characters");
        } else {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release();
                    return res.status(500).send("Something went wrong");
                } else {
                    const qu =
                        'INSERT INTO users (name,email,phone,password) VALUES (?,?,?,?)';

                    connection.query(qu, [nm, ema, phn, pass], (err, result) => {
                        if (err) {
                            return res.status(500).send("Something went wrong");
                        } else {
                            const q2 = "SELECT * FROM users WHERE email=?";

                            connection.query(q2, [ema], (err, results) => {
                                connection.release();

                                if (err) {
                                    return res.status(500).send("Something went wrong");
                                }

                                if (results.length === 1) {
                                    return res.status(200).json({
                                        Message:
                                            "User with these informations has been registered sucessfully:.",
                                        Infos: results
                                    });
                                } else {
                                    return res
                                        .status(400)
                                        .send("Registration Failed...");
                                }
                            });
                        }
                    });
                }
            });
        }
    }
};
