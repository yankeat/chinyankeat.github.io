<?php

header('Access-Control-Allow-Origin: *');

//////////////////////////////////////////////////////////
// Basic Auth
//$AUTH_USER = 'digibot';
//$AUTH_PASS = 'akl23kl!1l2kj9od13lkjsd';
//header('Cache-Control: no-cache, must-revalidate, max-age=0');
//$has_supplied_credentials = !(empty($_SERVER['PHP_AUTH_USER']) && empty($_SERVER['PHP_AUTH_PW']));
//$is_not_authenticated = (
//	!$has_supplied_credentials ||
//	$_SERVER['PHP_AUTH_USER'] != $AUTH_USER ||
//	$_SERVER['PHP_AUTH_PW']   != $AUTH_PASS
//);
//if ($is_not_authenticated) {
//	header('HTTP/1.1 401 Authorization Required');
//	header('WWW-Authenticate: Basic realm="Access denied"');
//	exit;
//}
//////////////////////////////////////////////////////////

$json = json_decode(file_get_contents("php://input"));
//file_put_contents('./log.txt', $json->id . "\n", FILE_APPEND);

$tsql = "seek_add_order";

$param1 = str_replace("'", "''",$json->customer_name);
$param2 = str_replace("'", "''",$json->product_id);
$param3 = str_replace("'", "''",$json->quantity);
$tsql .= " '$param1'";
$tsql .= ",'$param2'";
$tsql .= ",$param3";


//////////////////////////////////////////////////////////
// send our statement directly to database
$serverName = "yankeatdb.database.windows.net";
$uid = "chinyankeat";
$pwd = "Sony12#$%";
$databaseName = "yankeat3";

//$serverName = "digicentral.database.windows.net";
//$uid = "digicentral";
//$pwd = "mupay1828!";
//$databaseName = "digicentral";

$connectionInfo = array( "UID"=>$uid,
                         "PWD"=>$pwd,
                         "Database"=>$databaseName,
					     "CharacterSet" => "UTF-8");
/* Connect using SQL Server Authentication. */

$conn = sqlsrv_connect( $serverName, $connectionInfo);

if ($conn){
	/* Execute the query. */
	$stmt = sqlsrv_query( $conn, $tsql);

	if( $stmt === false )
	{
		 echo "Error in statement preparation/execution [$tsql]\n";
		 die( print_r( sqlsrv_errors(), true));
	}

	while ($response = sqlsrv_fetch_array($stmt)) {
		echo $response[0];

	}
	sqlsrv_free_stmt( $stmt);

}else{
//	exit;
	echo "connection fail";
}
sqlsrv_close($conn);
//////////////////////////////////////////////////////////

