<?php
function perseoquiz_shortcode() {
    ob_start();
    ?>
    <button id="open-quiz-btn" class="red-button">Apri il Quiz</button>

    <div id="quiz-popup" class="quiz-popup">
        <div class="quiz-popup-content">
            <a href="#" id="quiz-close-btn"><i class="fa fa-times"></i></a>
            <div id="quiz-section-personal-data">
                <!-- Qui verrà inserito il contenuto della sezione "Dati personali" -->
            </div>
            <div id="quiz-section-describe-symptoms">
                <h3>Descrivi i tuoi sintomi</h3>
                <p>Seleziona i tuoi sintomi dall'elenco sottostante:</p>
                <select id="quiz-symptoms-dropdown" name="quiz-symptoms-dropdown" multiple>
                    <!-- Le opzioni verranno aggiunte dinamicamente tramite JavaScript -->
                </select>


                <div id="quiz-selected-symptoms">
                    <!-- Qui verranno inseriti i sintomi selezionati -->
                </div>
                <button id="quiz-back-btn-2">INDIETRO</button>
                <button id="quiz-next-btn-2">AVANTI</button>
            </div>

            <div id="quiz-section-3" style="display: none;">
                <!-- Qui verrà inserito il contenuto della terza sezione -->
            </div>

        </div>
    </div>
    <?php
    return ob_get_clean();
}

add_shortcode( 'perseoquiz', 'perseoquiz_shortcode' );

function perseoquiz_get_symptoms() {
    global $wpdb;
    $symptoms = $wpdb->get_results("SELECT * FROM wh_sintomi");
    echo json_encode($symptoms);
    wp_die();
}
add_action('wp_ajax_perseoquiz_get_symptoms', 'perseoquiz_get_symptoms');
add_action('wp_ajax_nopriv_perseoquiz_get_symptoms', 'perseoquiz_get_symptoms');
