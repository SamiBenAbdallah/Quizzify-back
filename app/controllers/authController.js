const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { Op } = require("sequelize");

const authController = {
    register: async (req, res) => {
      // On récupère les données envoyées dans le formulaire d'inscription
      const {pseudo, email,  firstname, lastname, password, passwordConfirm} = req.body;

      // On vérifie que tous les champs sont remplis
      if (!pseudo || !email || !firstname || !lastname || !password || !passwordConfirm) {
        return res.status(400).json("Merci de remplir tous les champs");
      }

      // On vérifie que les mots de passe correspondent
      if (password !== passwordConfirm) {
        return res.status(400).json("Les mots de passe ne correspondent pas");
      }

      // On vérifie que l'email est valide
      if (!emailValidator.validate(email)) {
        return res.status(400).json("Merci de renseigner un email valide");
      }

      // On hash le mot de passe avant de l'enregistrer en base de données
      const hash = bcrypt.hashSync(password, 10);

      // On crée un nouvel utilisateur
      const newUser = {
        pseudo: pseudo,
        email: email,
        firstname: firstname,
        lastname: lastname,
        password: hash,
        role_id: 1,
      };

      try {
        const user = await User.create(newUser);
        res.redirect('/login');
      } catch (error) {
        res.status(500).json(error);
      }
    },

    login: async (req, res) => {
      // On récupère les données envoyées dans le formulaire de connexion
      const { email, password } = req.body;

      // On vérifie que tous les champs sont remplis
      if (!email || !password) {
        return res.status(400).json("Merci de remplir tous les champs");
      }

      // On vérifie que l'email est valide
      if (!emailValidator.validate(email)) {
        return res.status(400).json("Merci de renseigner un email valide");
      }

      try {
        const user = await User.findOne({
          where: {
            email: {
              // On utilise Op.iLike car on veut que la recherche soit insensible à la casse
              [Op.iLike]: email,
            }
          }
        })

        // Si la requête ne renvoie aucun utilisateur, c'est que l'email n'existe pas en base de données
        if (!user) {
          return res.status(400).json("Vos identifiants de connexion ne correspondent à aucun compte sur notre système");
        }

        // On compare le mot de passe envoyé dans le formulaire avec le hash enregistré en base de données
        const pass = bcrypt.compareSync(password, user.password);

        // Si les mots de passe ne correspondent pas, on renvoie une erreur
        if (!pass) {
          return res.status(400).json("Vos identifiants de connexion ne correspondent à aucun compte sur notre système");
        }

        // On redirige l'utilisateur vers la page d'accueil une fois connecté
        res.redirect('/');

      } catch (error) {
        res.status(500).json(error);
      }
    }
};

module.exports = authController;