<?php

use Discord\Discord;
use Discord\Parts\Channel\Message;
use Discord\WebSockets\Event;
use Discord\WebSockets\Intents;

require_once('./vendor/autoload.php');
require_once('./key.php');
$key = getKey();

$discord = new Discord(
    ['token' => $key]
);

$discord->on('init', function (Discord $discord) {
    echo 'KLAAR OM TE ZUIPU' . PHP_EOL;

    // Listen for messages.
    $discord->on(Event::MESSAGE_CREATE, function (Message $message, Discord $discord) {
        echo "{$message->author->username}: {$message->content}" . PHP_EOL;
        // Note: MESSAGE_CONTENT intent must be enabled to get the content if the bot is not mentioned/DMed.
    });

    // $discord->on('message', function ($message, $discord) {
    //     echo $message->content;
    // });
});


$discord->run();
