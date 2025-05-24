<?php
// à installer sur votre serveur local
// dans dossier web
// puis dans /ihm/IHM_API/
	
	// Sécurité : cette API exécute les requêtes SQL envoyées par le client.
	// Elle est réservée à un usage local et refuse toute requête distante.
	if (!in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true)) {
		http_response_code(403);
		exit('{}');
	}

	require_once ("./MyConnexionBdd.class.php");

	function bdOpen ($host, $port, $bdname, $user, $pwd, $charset, $driver)
	{
		return MyConnexion::getInstance($host, $port, $bdname, $user, $pwd, $charset, $driver);		
	}
	
	function resultat ($sp)      
	{
		$data = [];
	    $t = [];
	    while ($row = $sp->fetch(PDO::FETCH_ASSOC))
		{		
			$t[]=$row;	
		}
		$data['resultat'] = $t;

	    return json_encode($data);
	}

$obj = json_decode($_POST['bd']);
if (!empty((array) $obj)) {
	$bdparams = json_decode($_POST['bd']);
}

	
if (isset($_POST['req'])) {
	$interrogation = ($_POST['req'] != 'manipulation'); 
}
$bdd = bdOpen($bdparams->host,$bdparams->port,$bdparams->bdname,$bdparams->user,$bdparams->pwd,$bdparams->charset,$bdparams->driver);
if ($_POST['sp'] != '') {
	$lesparams = json_decode(urldecode($_POST['params']));	

		$sp = $bdd->prepare($_POST['sp']);
		if ($lesparams!="") {
		   for($i=0;$i<count($lesparams);$i++) {
			$unparam = trim($lesparams[$i]);
			if ( ($unparam == '') && ($interrogation) ) {
				$unparam = 'zzz';
			}
			$sp->bindValue($i+1, $unparam, PDO::PARAM_STR);
		} 
	}
	
	$sp->execute();

	echo(resultat($sp));
}
else { 
	echo("{}");
}



?>