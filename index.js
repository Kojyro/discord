const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});

//Arrivés
Client.on("guildMemberAdd", member => {
    console.log("Un membre est arrivé.");
    const newMembre = new Discord.MessageEmbed()
    .setColor("#000000")
    .setTitle("Un nouveau membre est arrivé!")
    .addField("Bienvenue", "<@" + member.id + "> vient juste d'arriver! Vas tchecker les <#917055850462470157> pour pouvoir continuer!")
    .setImage("https://cdn.discordapp.com/attachments/840687384811274273/925065618774974536/novaskin-minecraft-wwallpaper_1.png")
    .setFooter("S'n'K", "https://cdn.discordapp.com/attachments/840687384811274273/924727209804066846/ezgif-3-f80b94b17b.gif")

    Client.channels.cache.get("917055851053850636").send({ embeds: [newMembre] });
    member.roles.add("924689617440108545");
        
});

//Départs
Client.on("guildMemberRemove", member => {
    console.log("Un membre est parti.");
    Client.channels.cache.get("924809338424541204").send("<@" + member.id + "> s'en va déjà.. Bonne continuation à toi!^^");
});


//Commande !ban
Client.on("message", message => {
    if(message.author.bot) return;
    if(message.channel.type == "dm") return;

    if(message.member.permissions.has("ADMINISTRATOR")){
        if(message.content.startsWith(prefix + "ban")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Veillez ping le membre à bannir.");
            }
            else {
                if(mention.bannable){
                    mention.ban();
                    message.channel.send(mention.displayName + " a été banni avec succès!");
                }
                else {
                    message.reply("Impossible de bannir cet utilisteur.");
                }
            }
        }
        else if(message.content.startsWith(prefix + "kick")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Veillez ping le membre à kick.");
            }
            else {
                if(mention.kickable){
                    mention.kick();
                    message.channel.send(mention.displayName + " a été kick avec succès!");
                }
                else {
                    message.reply("Impossible de kick cet utilisteur.");
                }
            }
        }
        else if(message.content.startsWith(prefix + "mute")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Veillez ping le membre à mute.");
            }
            else {
                 mention.roles.add("917055849917206610");
                message.channel.send(mention.displayName + " a été mute avec succès!");
            }
        }
        else if(message.content.startsWith(prefix + "unmute")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Veillez ping le membre à unmute.");
            }
            else {
                mention.roles.remove("917055849917206610");
                message.channel.send(mention.displayName + " a été unmute avec succès!");
            }
            
        }
        else if(message.content.startsWith(prefix + "tempmute")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Veillez ping le membre à tempmute.")
            }
            else{
                let args = message.content.split(" ");

                mention.roles.add("917055849917206610");
                message.channel.send(mention.displayName + " a été tempmute avec succès!");
                setTimeout(function() {
                    mention.roles.remove("917055849917206610");
                    message.channel.send("<@" + mention.id + "> a désormais unmute")
                }, args[2] * 1000);
            }
        }
    }

})


//auto rôle
Client.on("messageReactionAdd", (reaction, user) => {
    if(user.bot) return;

    console.log("Réaction ajouté par : " + user.username + "\nNom de l'émoji '" + reaction.emoji.name + "' c'est la " + reaction.count + "e réaction.");

    if(reaction.message.id === "924675027700449300"){
        if(reaction.emoji.name === "valide"){
            var member = reaction.message.guild.members.cache.find(member => member.id === user.id);
            member.roles.add("917055849883639887").then(mbr => {
                console.log("rôle ajouté avec succès à " + mbr.displayName);
            }).catch(err => {
                console.log("le rôle n'as pas été ajouté : " + err)
            })
            var member = reaction.message.guild.members.cache.find(member => member.id === user.id);
            member.roles.remove("924689617440108545")
        }
    }
})

Client.on("messageReactionRemove", (reaction, user) => {
    console.log("Réaction retiré par : " + user.username);

    if(reaction.message.id === "924675027700449300"){
        if(reaction.emoji.name === "valide"){
            var member = reaction.message.guild.members.cache.find(member => member.id === user.id);
            member.roles.remove("917055849883639887")
            var member = reaction.message.guild.members.cache.find(member => member.id === user.id);
            member.roles.add("924689617440108545").then(mbr => {
                console.log("rôle ajouté avec succès à " + mbr.displayName);
            }).catch(err => {
                console.log("le rôle n'as pas été ajouté : " + err)
            })
        }
    }
})





//Commande !clear
Client.on("message", message => {
    if(message.member.permissions.has("MANAGE_MESSAGES")){
        if(message.content.startsWith(prefix + "clear")){
            let args = message.content.split(" ");

            if(args[1] == undefined){
                message.reply("Veillez insérer un nombre correct de message à suprrimer.");
            }
            else{
                let number = parseInt(args[1]);

                if(isNaN(number)){
                    message.reply("Veillez insérer un nombre correct de message à supprimer.");
                }
                else{
                    message.channel.bulkDelete(number).then(messages => {
                        console.log("Supression de " + messages.size + " messages réussi !");
                    }).catch(err => {
                        console.log("Erreur de supression de messages : " + err);
                    });
                }
            }
        }
    }
});



//Commande app /ping
const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Renvoie pong")
    .addUserOption(option => option
        .setName("utilisateur")
        .setDescription("Utilisateur que vous souhaitez mentionner")
        .setRequired(false));


const prefix = "!";

//lancement du bot
Client.on("ready", () => {

    //Client.application.commands.create(data);
    //version longue pour tout server en général

    Client.guilds.cache.get("917055849883639878").commands.create(data);
    //Version manuelle par server (server perso)

    console.log("bot opérationnel");
    //verif du lancement du bot

    Client.guilds.cache.find(guild => guild.id === "917055849883639878").channels.cache.find(channel => channel.id === "917055850462470157").messages.fetch("924675027700449300").then(message => {
        console.log("message ajouté à la mémoire : " + message.content);
    }).catch(err => {
        console.log("Erreur de mémorisation du message : " + err);
    })
});












//interaction du /ping

Client.on("interactionCreate", interaction => {
    if(interaction.isCommand()){
        if(interaction.commandName === "ping"){
            let user = interaction.options.getUser("Utilisateur");

            if(user != undefined){
                interaction.reply("pong <@" + user.id + ">");
            }
            else {
                interaction.reply("pong");
            }
        }


    }
})








//message/réponse d'un "!..."
Client.on("messageCreate", message => {
    if (message.author.bot) return;

    //!ping
    if(message.content === prefix + "ping"){
        message.reply("pong !");
    }

//!Help
    else if(message.content === prefix + "help"){
        const embed = new Discord.MessageEmbed()
            .setColor("DARK_RED")
            .setTitle("Liste des commandes:")
            .setAuthor("Commandes", "https://cdn.discordapp.com/attachments/840687384811274273/924727209804066846/ezgif-3-f80b94b17b.gif", "")
            .addField("*__Commandes des membres:__*", "__Les mebres pourront utiliser:__")
            .addField("__!help__", "Affiche cette liste des commandes.")
            .addField("__!ping__", "Vous renvoie pong!")
            .addField("__!youtube S__", "Envoie un lien vers la chaîne YouTube de Starfar3000.")
            .addField("__!youtube K__", "Envoie un lien vers la chaîne YouTube de Kojyro.")
            .addField("__!twitch K__", "Envoie un lien vers la chaîne Twitch de Kojyro.")
            .addField("*__Commandes modérations:__*", "__Les modérateurs pourront utiliser:__")
            .addField("__!ban__", "Permet de ban un membre")
            .addField("__!kick__", "Permet de kick un membre")
            .addField("__!mute__", "Permet de mute un membre")
            .addField("__!unmute__", "Permet d'unmute un membre")
            .addField("__!tempmute__", "Permet de tempmute un membre")
            .addField("__!clear__", "Permet de supprimer des messages");

        message.channel.send({ embeds: [embed]})
    }

//YouTube starfar3000
    else if(message.content === prefix + "youtube S"){
        const embed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("Chaîne YouTube de Starfar3000.")
            .setURL("https://www.youtube.com/channel/UC9Q2Nx_R_a9rD8jJZHF6FmQ")
            .setAuthor("Starfar3000", "https://cdn.discordapp.com/attachments/840687384811274273/924765270575312947/KOJYRfsdqgqsgfsd0.png", "https://www.youtube.com/channel/UC9Q2Nx_R_a9rD8jJZHF6FmQ")
            .setDescription("Abonne-toi!")
            .setThumbnail("https://cdn.discordapp.com/attachments/840687384811274273/924765270575312947/KOJYRfsdqgqsgfsd0.png");

        message.channel.send({ embeds: [embed]})
    }

//YouTube Kojyro
    else if(message.content === prefix + "youtube K"){
        const embed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("Chaîne YouTube de Kojyro")
            .setURL("https://www.youtube.com/channel/UCp1UQJHj8WvXqdN1mKBEUWQ")
            .setAuthor("Kojyro", "https://cdn.discordapp.com/attachments/840687384811274273/924727307405496350/logo_-_Copie.png", "https://www.youtube.com/channel/UCp1UQJHj8WvXqdN1mKBEUWQ")
            .setDescription("Abonne-toi!")
            .setThumbnail("https://cdn.discordapp.com/attachments/840687384811274273/924727307405496350/logo_-_Copie.png");

        message.channel.send({ embeds: [embed]})
    }

//Twitch Kojyro
    else if(message.content === prefix + "twitch K"){
        const embed = new Discord.MessageEmbed()
            .setColor("PURPLE")
            .setTitle("Chaîne Twitch de Kojyro")
            .setURL("https://www.twitch.tv/kojyr0")
            .setAuthor("Kojyro", "https://cdn.discordapp.com/attachments/840687384811274273/924727307405496350/logo_-_Copie.png", "https://www.twitch.tv/kojyr0")
            .setDescription("Follow!")
            .setThumbnail("https://cdn.discordapp.com/attachments/840687384811274273/924727307405496350/logo_-_Copie.png");

        message.channel.send({ embeds: [embed]})
    }   

//Quoi?-FEUR!
    else if(message.content == "quoi"){
        message.reply("feur");
    }
    else if(message.content == "Quoi"){
        message.reply("feur!");
    }
    else if(message.content == "QUOI"){
        message.reply("FEUR!");
    }
});


//Giveways



    //login important
Client.login("OTI0NzA3MTYyNTQwODY3NTk1.Yciepw.Ye7930VxtxihtOnP9s24bMJq06Y")

