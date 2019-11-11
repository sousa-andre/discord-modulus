import discord from "discord.js";

export interface Command{
    ready(): void,
    message(data: discord.Message, parsedMessage: object): void
}

export interface CommandConfiguration {
    command: Command,
    description: string,
    aliases: Array<string>,
    admin?: boolean,
    prefix?: string
}

export interface MessageCommand{
    command: string,
    parameters: Array<string>
}

export abstract class BaseCommand{
    protected commands: Array<{identifier: string, callable: Function}> = [];
    protected deliver(data: discord.Message, messageCommand: MessageCommand): void{
        this.commands.forEach((command)=>{
            if (messageCommand.command !== command.identifier) return;
            command.callable(data, messageCommand);
        });
    }
}

export function parse(messageContent: string): MessageCommand{
    let tokens: Array<string> = messageContent.split(/ +/);
    return {
        command: tokens[0],
        parameters: tokens.slice(1)
    };
}

export function transform(messageCommand: MessageCommand): MessageCommand{
    if (messageCommand.parameters.length < 1) throw new RangeError('Not enough parameters to transform the object.');
    return {
        command: messageCommand.parameters[0],
        parameters: messageCommand.parameters.slice(1)
    }
}
