<?php
/**
 * Il file base di configurazione di WordPress.
 *
 * Questo file viene utilizzato, durante l’installazione, dallo script
 * di creazione di wp-config.php. Non è necessario utilizzarlo solo via
 * web, è anche possibile copiare questo file in «wp-config.php» e
 * riempire i valori corretti.
 *
 * Questo file definisce le seguenti configurazioni:
 *
 * * Impostazioni MySQL
 * * Prefisso Tabella
 * * Chiavi Segrete
 * * ABSPATH
 *
 * È possibile trovare ultetriori informazioni visitando la pagina del Codex:
 *
 * @link https://codex.wordpress.org/it:Modificare_wp-config.php
 *
 * È possibile ottenere le impostazioni per MySQL dal proprio fornitore di hosting.
 *
 * @package WordPress
 */

// ** Impostazioni MySQL - È possibile ottenere queste informazioni dal proprio fornitore di hosting ** //
/** Il nome del database di WordPress */
define('DB_NAME', 'wordpress');

/** Nome utente del database MySQL */
define('DB_USER', 'antonio');

/** Password del database MySQL */
define('DB_PASSWORD', 'ingegneria2017');

/** Hostname MySQL  */
define('DB_HOST', 'localhost');

/** Charset del Database da utilizzare nella creazione delle tabelle. */
define('DB_CHARSET', 'utf8mb4');

/** Il tipo di Database Collation. Da non modificare se non si ha idea di cosa sia. */
define('DB_COLLATE', '');

/**#@+
 * Chiavi Univoche di Autenticazione e di Salt.
 *
 * Modificarle con frasi univoche differenti!
 * È possibile generare tali chiavi utilizzando {@link https://api.wordpress.org/secret-key/1.1/salt/ servizio di chiavi-segrete di WordPress.org}
 * È possibile cambiare queste chiavi in qualsiasi momento, per invalidare tuttii cookie esistenti. Ciò forzerà tutti gli utenti ad effettuare nuovamente il login.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         ' N+S/_mLN6#aZS2s!twQQ}!#(R$+XZ$Asqa-kB F#YX}8#g(taltCRneK_,s3[en');
define('SECURE_AUTH_KEY',  '_08MGQcK{Rdn^,>bPYmC/m/O,Tj-o^gbn2E[Ap6TpFH3{+,Jze>5|M}?)GVU&25d');
define('LOGGED_IN_KEY',    '7Wm+TYRN2p[>sDit]WceeI(!KlOa){lW$]sq.6vc[74rAAp09wdFQ:3-rKA/3g|#');
define('NONCE_KEY',        '-jD-(+0/DQ;|3;$8hvx-j+]~~KHFLKp~y;z-DJgfzvC;xn#^(n/EBUx*=CZs83nn');
define('AUTH_SALT',        '!DOb|CI%r}sG]x//zJ{094NqfG~t5fb]$;8B(_s+`0z}8K]j,yEM^yWHa)@&Wc|i');
define('SECURE_AUTH_SALT', 'wMTxS]jOmU]nda<Z7Q&ofl);_perl},kikt~bN:JSa$Zp,dwc9gm3Z{W.{n0R>2;');
define('LOGGED_IN_SALT',   'w;PRjMK3KW IO565ASu=D1U[tNSlLqz_1yY~dKdNgBmdDQGLV17{{h>~X?2Raqt)');
define('NONCE_SALT',       '_larsqkZ<_J#X! fK*BZ96b6![Qxv[o(BxJaUn`!_6M-TlkOoJxoASC*Jq=9)zM)');

/**#@-*/

/**
 * Prefisso Tabella del Database WordPress.
 *
 * È possibile avere installazioni multiple su di un unico database
 * fornendo a ciascuna installazione un prefisso univoco.
 * Solo numeri, lettere e sottolineatura!
 */
$table_prefix  = 'wp_';

/**
 * Per gli sviluppatori: modalità di debug di WordPress.
 *
 * Modificare questa voce a TRUE per abilitare la visualizzazione degli avvisi
 * durante lo sviluppo.
 * È fortemente raccomandato agli svilupaptori di temi e plugin di utilizare
 * WP_DEBUG all’interno dei loro ambienti di sviluppo.
 */
define('WP_DEBUG', false);

/* Finito, interrompere le modifiche! Buon blogging. */

/** Path assoluto alla directory di WordPress. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Imposta le variabili di WordPress ed include i file. */
require_once(ABSPATH . 'wp-settings.php');