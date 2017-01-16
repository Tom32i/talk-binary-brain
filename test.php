<?php

$binary = pack("C*", 12, 255);
$values = unpack("C*", $binary);

var_dump($content);
var_dump($data);
