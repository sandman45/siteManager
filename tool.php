<?php
    mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
    $charid = strtoupper(md5(uniqid(rand(), true)));
    $hyphen = chr(45);// "-"
    $guid = substr($charid, 0, 8).
             substr($charid, 8, 4).
             substr($charid,12, 4).
             substr($charid,16, 4).
             substr($charid,20,12);
?>
