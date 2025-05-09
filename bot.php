<?php

use Discord\Discord;
use Discord\Parts\Channel\Message;
use Discord\WebSockets\Event;
use Discord\WebSockets\Intents;
use Discord\Voice\VoiceClient;

require_once('./vendor/autoload.php');
require_once('./key.php');
$key = new Key;
$token = $key->getKey();

$discord = new Discord(
    [
        'token' => $token,
        'intents' => Intents::getDefaultIntents() | Intents::MESSAGE_CONTENT | Intents::GUILD_VOICE_STATES
    ]
);

$discord->on('init', function (Discord $discord) {
    echo 'KLAAR OM TE ZUIPU!!!!!' . PHP_EOL;

    // Listen for messages.
    $discord->on(Event::MESSAGE_CREATE, function (Message $message, Discord $discord) {
        // Note: MESSAGE_CONTENT intent must be enabled to get the content if the bot is not mentioned/DMed.

        echo "{$message->author->username}: {$message->content}" . PHP_EOL;

        // If message is from a bot
        if ($message->author->bot && str_contains(strtolower($message->content), 'pong')) {
            $message->reply('houd je bakkes');
            return;
        }

        // If message is "ping"
        if (str_contains(strtolower($message->content), 'ping')) {
            // if ($message->content == 'ping') {
            // Reply with "pong"
            $message->reply('pong');
        }


        // Make bot join voice channel
        if (str_contains(strtolower($message->content), '!join')) {
            // TODO: fix deze code!
            $guild = $message->guild;

            $voiceStates = $guild->voiceStates;

            if ($voiceStates !== null) {
                echo "gelukt!";
                $voiceState = $voiceStates->get('user_id', $message->author->id);
            }

            if (! $voiceState || ! $voiceState->channel) {
                $message->reply('Je zit niet in een voice channel.');
                return;
            }
        }
    });
});


$discord->run();
