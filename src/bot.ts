import discord from 'discord.js';

import { CommandConfiguration, MessageCommand, parse, transform } from './commands';

export default class Bot{
    public readonly client: discord.Client;
    private commandPrefix = '';
    private commands: Array<CommandConfiguration> = [];

    constructor(){
        this.client = new discord.Client();
        this.client.on('ready', this.handleReady.bind(this));
        this.client.on('message', this.handleMessage.bind(this));
    }
    
    public run(token?: string): void{
        this.client.login(token || process.env.DISCORD_BOT_TOKEN)
    }

    public getHelp(){}

    public get prefix(): string{
        return this.commandPrefix;
    }

    public setPrefix(prefix: string){
        this.commandPrefix = prefix;
    }

    public addCommand(command: CommandConfiguration){
        this.commands.push(command);
    }

    private async handleReady(){
        this.commands.forEach((commandConfig: CommandConfiguration)=>{
            commandConfig.command.ready();
        });
    }

    private async handleMessage(message: discord.Message){
        this.commands.forEach((commandConfig: CommandConfiguration)=>{
            // ignore if user tried to use an admin only command and he's not admin
            if ((commandConfig.admin) && (message.member.roles.find(r => r.name === 'andre-admin'))) return;

            // tokenize the content of the message

            let prefix = commandConfig.prefix?commandConfig.prefix:this.prefix;

            if (message.content.startsWith(prefix)){
                for (let alias of commandConfig.aliases){
                    let messageWithoutPrefix = message.content.substr(prefix.length);
                    let messageTokens: MessageCommand = parse(messageWithoutPrefix);

                    commandConfig.command.message(message, transform(messageTokens));
                }
            }
        })
    }
}