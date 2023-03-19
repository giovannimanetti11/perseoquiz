<?php
/*
Plugin Name: PerseoQuiz
Plugin URI: https://www.wikiherbalist.com
Description: Plugin WordPress che gestisce un quiz per il sito WikiHerbalist.com
Version: 1.0.0
Author: Giovanni Manetti
Author URI: https://www.perseodesign.com
License: GPLv2 or later
Text Domain: perseoquiz
*/


require_once( plugin_dir_path( __FILE__ ) . 'quiz.php' );


function perseoquiz_enqueue_styles() {
    wp_enqueue_style( 'perseoquiz-style', plugin_dir_url( __FILE__ ) . 'style.css' );
}
add_action( 'wp_enqueue_scripts', 'perseoquiz_enqueue_styles' );


function perseoquiz_enqueue_scripts() {
    wp_enqueue_script('quiz-js', plugins_url('quiz.js', __FILE__));
    wp_localize_script('quiz-js', 'quiz_ajax_obj', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('quiz_ajax_nonce')
    ));
    
}
add_action( 'wp_enqueue_scripts', 'perseoquiz_enqueue_scripts' );



