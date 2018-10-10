<?php

// Create a unsigned int
$binary = pack("S*", 61330, 7307, 20729);
// string(6)

// Read as 16bit unsigned integers
$values = unpack("S*", $binary);
// [61330, 7307, 20729]

var_dump($binary);
var_dump($values);
