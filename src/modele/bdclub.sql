SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
--  Table structure for `abonnement`
-- ----------------------------
DROP TABLE IF EXISTS `abonnement`;
CREATE TABLE `abonnement` (
  `abon_num` int(11),
  `abon_date` date NOT NULL,
  `abon_comment` varchar(400) DEFAULT NULL,
  `adh_num` int(11) NOT NULL,
  PRIMARY KEY (`abon_num`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `csp`
-- ----------------------------
DROP TABLE IF EXISTS `csp`;
CREATE TABLE `csp` (
  `csp_num` varchar(5) NOT NULL,
  `csp_lib` varchar(100) NOT NULL,
  PRIMARY KEY (`csp_num`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `THEME`
-- ----------------------------
DROP TABLE IF EXISTS `theme`;
CREATE TABLE `theme` (
  `theme_num` int(11) NOT NULL AUTO_INCREMENT,
  `theme_lib` varchar(20) NOT NULL,
  `theme_tarif` decimal(5,2) NOT NULL,
  PRIMARY KEY (`theme_num`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `adherent`
-- ----------------------------
DROP TABLE IF EXISTS `adherent`;
CREATE TABLE `adherent` (
  `adh_num` int(11) NOT NULL AUTO_INCREMENT,
  `adh_civ` varchar(3) NOT NULL,
  `adh_nom` varchar(20) NOT NULL,
  `adh_prenom` varchar(20) NOT NULL,
  `adh_adr` varchar(50) DEFAULT NULL,
  `adh_cp` varchar(5) DEFAULT NULL,
  `adh_ville` varchar(30) DEFAULT NULL,
  `adh_mel` varchar(50) NOT NULL,
  `csp_num` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`adh_num`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `ADHESION`
-- ----------------------------
DROP TABLE IF EXISTS `adhesion`;
CREATE TABLE `adhesion` (
  `abon_num` int(11) NOT NULL,
  `theme_num` int(11) NOT NULL,
  `envoi_papier` boolean NOT NULL,  
  PRIMARY KEY (`abon_num`,`theme_num`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
-- ----------------------------
--  Records 
-- ----------------------------
INSERT INTO `abonnement` VALUES ('1','2022-04-03','ne souhaite pas une relance à la fin de son abonnement','2'), ('2','2022-08-11','','3'), ('5','2022-08-11','','2'), ('7','2022-10-05','','2'),  ('3','2022-05-31','','4'), ('4','2022-02-28','aucun commentaire','5'), ('6','2022-07-09','','6')
, ('9','2022-12-08','','7'), ('8','2022-01-27','','7');

INSERT INTO `csp` VALUES ('1','Agriculteurs exploitants'), ('10','Agriculteurs exploitants')
, ('11','Agriculteurs sur petite exploitation'), ('12','Agriculteurs sur moyenne exploitation')
, ('13','Agriculteurs sur grande exploitation'), ('2','Artisans, commerçants et chefs d\'entreprise')
, ('21','Artisans'), ('22','Commerçants et assimilés'), ('23','Chefs d\'entreprise de 10 salariés ou plus')
, ('3','Cadres et professions intellectuelles supérieures'), ('31','Professions libérales et assimilés')
, ('32','Cadres de la fonction publique, professions intellectuelles et  artistiques')
, ('33','Cadres de la fonction publique'), ('34','Professeurs, professions scientifiques')
, ('35','Professions de l\'information, des arts et des spectacles'), ('36','Cadres d\'entreprise')
, ('37','Cadres administratifs et commerciaux d\'entreprise')
, ('38','Ingénieurs et cadres techniques d\'entreprise')
, ('4','Professions Intermédiaires')
, ('41','Professions intermédiaires de l\'enseignement, de la santé, de la fonction publique et assimilés')
, ('42','Professeurs des écoles, instituteurs et assimilés')
, ('43','Professions intermédiaires de la santé et  du travail social')
, ('44','Clergé, religieux'), ('45','Professions intermédiaires administratives de la fonction publique')
, ('46','Professions intermédiaires administratives et commerciales des entreprises'), ('47','Techniciens')
, ('48','Contremaîtres, agents de maîtrise'), ('5','Employés'), ('51','Employés de la fonction publique')
, ('52','Employés civils et agents de service de la fonction publique'), ('53','Policiers et militaires')
, ('54','Employés administratifs d\'entreprise'), ('55','Employés de commerce')
, ('56','Personnels des services directs aux particuliers'), ('6','Ouvriers'), ('61','Ouvriers qualifiés')
, ('62','Ouvriers qualifiés de type industriel'), ('63','Ouvriers qualifiés de type artisanal')
, ('64','Chauffeurs'), ('65','Ouvriers qualifiés de la manutention, du magasinage et du transport')
, ('66','Ouvriers non qualifiés'), ('67','Ouvriers non qualifiés de type industriel')
, ('68','Ouvriers non qualifiés de type artisanal'), ('69','Ouvriers agricoles'), ('7','Retraités')
, ('71','Anciens agriculteurs exploitants'), ('72','Anciens artisans, commerçants, chefs d\'entreprise')
, ('73','Anciens cadres et professions intermédiaires'), ('74','Anciens cadres')
, ('75','Anciennes professions intermédiaires'), ('76','Anciens employés et ouvriers')
, ('77','Anciens employés'), ('78','Anciens ouvriers')
, ('8','Autres personnes sans activité professionnelle'), ('81','Chômeurs n\'ayant jamais travaillé')
, ('82','Inactifs divers (autres que retraités)'), ('83','Militaires du contingent')
, ('84','Elèves, étudiants')
, ('85','Personnes diverses sans activité  professionnelle de moins de 60 ans (sauf retraités)')
, ('86','Personnes diverses sans activité professionnelle de 60 ans et plus (sauf retraités)');

INSERT INTO `theme` VALUES ('1','manga','7.00'), ('2','comédie','4.00'), ('3','fantastique','9.00')
, ('4','action','5.00'), ('5','science fiction','5.00'), ('6','bande dessinée','4.00')
, ('7','humour','8.00'), ('8','aventure','9.00'), ('9','sport','6.00'), ('10','politique','11.00')
, ('11','actualités','7.00'), ('12','série TV','5.00'), ('13','espionnage','8.00')
, ('14','militaire','9.00'), ('15','guerre','7.00'), ('16','épouvante','5.00'), ('17','droit','12.00');

INSERT INTO `adherent` VALUES
 ('1','M.','BOZZO','Raoul','24 rue du cirque','57000','Metz','bozzo.raoul@gmail.com','33')
, ('2','Mme','CREZINA','Albertine','37 avenue Caranaval','54000','Nancy','alb.crezina@free.fr','42')
, ('3','M.','DRAGON','Fragonard','7 rue du Feu éteint','75000','Paris','DragonFra@gmail.com','61')
, ('4','M.','FICZERSKI','Karloff','2a rue des Tyrans','57000','Metz','karloff5577@bbox.fr','12')
, ('5','Mme','TALAOUI','Amina','','','','talaouinon@gmail.com','42')
, ('6','Mme','RICANEUR','Eloise','98 impasse du Muguet','54000','Nancy','ricaneuresiole@bbox.fr','36')
, ('7','M.','LEBRAILLARD','Phil',NULL,NULL,NULL,'phil.lebraillard@gmail.com','72');

INSERT INTO `adhesion` VALUES ('1','5',true), ('1','6',false), ('1','7',false), ('2','8',false)
, ('2','9',true), ('2','10',true), ('2','11',false), ('5','12',false), ('5','13',false), ('5','14',true)
, ('7','15',false), ('7','16',false), ('3','1',false), ('3','17',false), ('4','6',true), ('6','2',false)
, ('6','4',false), ('8','1',false), ('8','3',false), ('9','5',true), ('9','6',false), ('9','7',false);
