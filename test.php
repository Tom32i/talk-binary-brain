<?php

$binary = pack("C*", 50, 12, 255);
$values = unpack("C*", $binary);

var_dump($binary);
var_dump($values);
