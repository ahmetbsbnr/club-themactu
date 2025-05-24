<?php
class MyConnexion
{
	private static $instance = null;
	private $connexion;
	private $server; 
	private $username;
	private $password; 

	private function __construct($host, $port, $bdname, $user, $pwd, $charset='utf8', $driver='mysql' )
	{
	try
		{
			$dsn = $driver.":host=" .$host .";port=" .$port .";dbname=" .$bdname .";charset=" .$charset;	
			$this->connexion = new PDO ($dsn, $user, $pwd);
		}
        // Une exception est levee uniquement si une erreur est trouvee
    catch (PDOException $e)
        {
            echo ("Probl&egrave;me connexion &agrave; la base de donn&eacute;es !");
            exit ();
        } 
	}

	public static function getInstance($host, $port, $bdname, $user, $pwd, $driver='mysql')
	{
	if (self::$instance == null)
		{
			self::$instance = new MyConnexion($host, $port, $bdname, $user, $pwd, $driver);
		}

		return self::$instance;
	}

	public function prepare ($sql, $options=NULL)
	{
		$statement = $this->connexion->prepare($sql);
		if (strpos(strtoupper($sql),'SELECT') === 0)  
		{
			$statement->fetch(PDO::FETCH_ASSOC);
		}
		return $statement;
	}	
}	
 	
?>