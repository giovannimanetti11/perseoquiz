<?php
function perseoquiz_shortcode() {
    ob_start();
    ?>
    <button id="open-quiz-btn" class="red-button">Apri il Quiz</button>

    <div id="quiz-popup" class="quiz-popup">
        <div class="quiz-popup-content">
            <a href="#" id="quiz-close-btn"><i class="fa fa-times"></i></a>
            <!-- SEZIONE 1 - DATI PERSONALI -->
            <div id="quiz-section-personal-data">
                <!-- Il contenuto è generato da quiz.js -->
            </div>
            <!-- SEZIONE 2 - SINTOMI -->
            <div id="quiz-section-describe-symptoms">
                <h3>Seleziona i sintomi</h3>
                <p>Puoi selezionare anche più di un sintomo dall'elenco sottostante:</p>
                <div class="form-row">
                    <input type="text" id="quiz-symptoms-search" placeholder="Cerca sintomi...">
                    <select id="quiz-symptoms-dropdown" name="quiz-symptoms-dropdown">
                        <!-- Il contenuto è generato da quiz.js -->
                    </select>
                    <input type="text" name="pwnneypot" id="pwnneypot" style="display:none;">
                </div>


                <div id="quiz-selected-symptoms">
                    <!-- Qui verranno inseriti i sintomi selezionati -->
                </div>
                <div class="control-buttons">
                    <button id="quiz-back-btn-2" class="btn btn-danger">INDIETRO</button>
                    <button id="quiz-next-btn-2" class="btn btn-success">AVANTI</button>
                </div>
            </div>
            <!-- SEZIONE 3 - RIMEDI -->
            <div id="quiz-section-remedies" style="display: none;">
                
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
    header('Content-Type: application/json');
    echo json_encode($symptoms);
    wp_die();
}
add_action('wp_ajax_perseoquiz_get_symptoms', 'perseoquiz_get_symptoms');
add_action('wp_ajax_nopriv_perseoquiz_get_symptoms', 'perseoquiz_get_symptoms');


function perseoquiz_get_herbs_by_symptoms() {
    check_ajax_referer('quiz_ajax_nonce', '_ajax_nonce', true);
    
    if (!isset($_POST['symptom_ids'])) {
        wp_send_json_error('Parametro mancante: symptom_ids');
    }

    $symptom_ids = explode(',', $_POST['symptom_ids']);

    global $wpdb;
    $herbs = $wpdb->get_results(
        "SELECT DISTINCT p.ID, p.guid, p.post_title as title
         FROM {$wpdb->posts} p
         INNER JOIN {$wpdb->term_relationships} tr ON p.ID = tr.object_id
         INNER JOIN {$wpdb->term_taxonomy} tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
         INNER JOIN {$wpdb->terms} t ON tt.term_id = t.term_id
         INNER JOIN wh_associazioni a ON t.term_id = a.tag_id
         WHERE a.sintomo_id IN (" . implode(',', array_map('intval', $symptom_ids)) . ")
         AND p.post_type = 'post'
         AND p.post_status = 'publish'
         ORDER BY p.post_title"
    );

    // Preparazione dei dati delle erbe
    $herbs_data = array();
    foreach ( $herbs as $herb ) {
        // Estrai il thumbnail
        $thumbnail_id = get_post_thumbnail_id( $herb->ID );
        $thumbnail_url = $thumbnail_id ? wp_get_attachment_url( $thumbnail_id ) : '';

        // Estrai il nome scientifico
        $scientific_name = get_post_meta( $herb->ID, 'meta-box-nome-scientifico', true );

        $herbs_data[] = array(
            'ID' => $herb->ID,
            'title' => $herb->title,
            'guid' => $herb->guid,
            'thumbnail' => $thumbnail_url,
            'scientific_name' => $scientific_name
        );
    }

    wp_send_json_success($herbs_data);
}

add_action('wp_ajax_perseoquiz_get_herbs_by_symptoms', 'perseoquiz_get_herbs_by_symptoms');
add_action('wp_ajax_nopriv_perseoquiz_get_herbs_by_symptoms', 'perseoquiz_get_herbs_by_symptoms');

