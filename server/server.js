/**
 * SERVER
 * @type type
 */
var Server = {
    scene: null,
    game: null,
    users: {},
    userscount: 0,
    timer: null,
    interval: null,
    map: null,
    players: [],
    /**
     * Lancement du server
     * @returns {undefined}
     */
    start: function () {
        this.scene  = Enum.Scene.MainMenu;
        this.game   = Enum.Game.Type.DeadMatch;
    },
    /**
     * Ajoute un utilisateur au server
     * @param {type} id
     * @param {type} username
     * @returns {undefined}
     */
    addUser: function (id, username) {
        this.users[id] = {
            id: id,
            username: username,
            team: Game[this.game].getDefaultTeam(),
            ready: false
        };
        Server.userscount++;
    },
    /**
     * Permet de raffraichir l'equipe de chaque utilisateur
     * @returns {undefined}
     */
    refreshUsersTeam: function () {
        for (var i in this.users) {
            this.users[i].ready = false;
            this.users[i].team = Game[this.game].getDefaultTeam();
        }
    },
    /**
     * Retourne TRUE si les utilisateurs sont pret
     * @returns {Boolean}
     */
    allUsersReady: function () {
        if (Server.userscount > 0) {
            for (var i in this.users) {
                if (!this.users[i].ready) {
                    return false;
                }
            }
            return true;
        }
        return false;
    },
    /**
     * Retourne TRUE si les utilisateurs sont pret
     * @returns {Boolean}
     */
    setAllUsersUnready: function () {
        for (var i in this.users) {
            this.users[i].ready = false;
        }
    },
    /**
     * Retourne TRUE si plus de utilisateurs sur le serveur
     * @returns {Boolean}
     */
    noPlayers: function () {
        if (this.users == null) return true;
        if (this.users.length > 0)    return false;
        if (this.users.length === 0)  return true;
        if (typeof this.users !== "object") return true;

        for (var key in this.users) {
            if (hasOwnProperty.call(this.users, key))
                return false;
        }

        return true;
    },
    /**
     * Lancement de la partie
     * @returns {undefined}
     */
    startGame: function () {
        this.scene = Enum.Scene.InGame;
        this.map = 'map' + (Math.floor(Math.random() * 1) + 1).toString();
        Game[this.game].construct();
        
        for (var i in this.users) {
            Game[this.game].addPlayer(this.users[i]);
        }
        Game[this.game].startGame();
    }
};
