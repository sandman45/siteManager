<?php

include_once('myClass.php');

$dbhost = "localhost";// http://184.22.119.250/
$dbuser = "root";
$dbpass = "yogidog88";
$query = "";
$queryCheck = $_POST['query'];
$queryData = $_POST['data'];

$querycheck = str_replace("\'","'",$querycheck );

$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error connecting to mysql');

$dbname = 'DB_TOM';
mysql_select_db($dbname)or die ("could not select db: ".mysql_error()."OH SNAP");

switch ($queryCheck) {
    case 'getSites':
        $query = "select name,url,id from sites where del=0;";
        break;
    case 'getCustomers':
        $query = "select * from customers where del=0;";
        break;
    case 'getCustomersBySite':
         //queryData;
        $query = "select * from sites s, customers c where s.id = c.websiteid and del = 0;";
         break;
    case 'addSite':
        include "tool.php";
        $query = "INSERT INTO sites (name,url,id,del)".
                   " VALUES ('".$queryData[name]."','".$queryData[url]."','".$guid."',0); ";
        break;
    case 'updateSite':
        $query = "UPDATE sites SET name = '".$queryData[name]."',url = '".$queryData[url]."',del = 0 WHERE id = '".$queryData[id]."';";
        break;

    case 'addCustomer':
        include "tool.php";
        $query = "INSERT INTO customers (first,last,address,phone,email,sourceip,id,sitesid)".
                   " VALUES ('".$queryData[first]."','".$queryData[last]."','".$queryData[address]."','".$queryData[phone]."','".$queryData[email]."','".$queryData[sourceip]."','".$guid."','".$queryData[siteid]."'); ";
        break;
    case 'delSite':
        $query = "UPDATE sites SET del = '1' WHERE id = '".$queryData[id]."';";
        break;
    case 'delCustomer':
        $query = "UPDATE customers SET del = '1' WHERE id = '".$queryData[id]."';";
        break;

}

if($queryCheck == 'getSites' || $queryCheck == 'getCustomers'){
        $result = mysql_query($query) or die ("Query failed: " . mysql_error() . " Actual query: " . $query);
        $rows = array();
        while($r = mysql_fetch_assoc($result)){
                $rows[]=$r;
        }
        $resp = new stdClass();
        $resp->success = false;
        if($result) {
                $resp->success = true;
                $resp->type = $queryCheck;
                $resp->results = $rows;
        }
        print json_encode($resp);

}else if($queryCheck == 'addSite' || $queryCheck == 'updateSite' || $queryCheck == 'addCustomer'){
        $result = mysql_query($query, $conn);
        $resp = new stdClass();
        $resp->type = $queryCheck;
        $resp->result = $result;
        $resp->success = false;
        if($result) {
                $resp->success = true;
        }
        print json_encode($resp);
}else if($queryCheck == 'delSite'||$queryCheck == 'delCustomer'){
        $result = mysql_query($query, $conn);
        $resp = new stdClass();
        $resp->success = false;
        if($result) {
                $resp->type = $queryCheck;
                $resp->success = true;
        }
        print json_encode($resp);
}

?>

