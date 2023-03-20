document.addEventListener("DOMContentLoaded", function () {
const openQuizBtn = document.getElementById("open-quiz-btn");
const quizPopup = document.getElementById("quiz-popup");
const personalDataSection = document.getElementById("quiz-section-personal-data");
const describeSymptomsSection = document.getElementById("quiz-section-describe-symptoms");
const quizNextBtn2 = document.getElementById("quiz-next-btn-2");
const quizBackBtn2 = document.getElementById("quiz-back-btn-2");
const quizSelectedSymptoms = document.getElementById("quiz-selected-symptoms");
const symptomsDropdown = document.getElementById("quiz-symptoms-dropdown");
const searchInput = document.getElementById('quiz-symptoms-search');
const quizSection3 = document.getElementById("quiz-section-3");


    // Mostra il popup quando si fa clic sul pulsante "Apri il Quiz"
    openQuizBtn.addEventListener("click", function () {
        quizPopup.style.display = "block";
    });

    // Permette di chiudere il popup cliccando l'icona x
    const quizCloseBtn = document.getElementById("quiz-close-btn");
    quizCloseBtn.addEventListener("click", function () {
        quizPopup.style.display = "none";
    });

    // Crea il contenuto della sezione "Dati personali"
    personalDataSection.innerHTML = `
        <h3>Dati personali</h3>
        <p>Per favore, compila i campi sottostanti per fornirti una risposta più personalizzata.</p>
        <div class="form-row">
            <input type="text" id="quiz-name" name="quiz-name" placeholder="Nome" required>
            <select id="quiz-age-range" name="quiz-age-range">
                <option value="">Fascia d'età</option>
                <option value="0">&lt; 18</option>
                <option value="1">19-25</option>
                <option value="2">26-35</option>
                <option value="3">36-45</option>
                <option value="4">46+</option>
            </select>
        </div>
        <div class="form-row">
            <input type="email" id="quiz-email" name="quiz-email" placeholder="Email" required>
            <select id="quiz-gender" name="quiz-gender">
                <option value="">Sesso</option>
                <option value="M">M</option>
                <option value="F">F</option>
            </select>
        </div>
        <button id="quiz-next-btn" class="btn btn-success">AVANTI</button>
    `;
    const nextBtn = document.getElementById("quiz-next-btn");

    // Passa alla sezione successiva quando si fa clic sul pulsante "AVANTI"
    nextBtn.addEventListener("click", function () {
        personalDataSection.style.display = "none";
        describeSymptomsSection.style.display = "block";
    });

    // Va alla sezione precedente quando si fa clic sul pulsante "INDIETRO"
    quizBackBtn2.addEventListener("click", function () {
        describeSymptomsSection.style.display = "none";
        personalDataSection.style.display = "block";
    });

    // Carica i sintomi dal database e aggiungi le opzioni al menu a tendina
    fetch(quiz_ajax_obj.ajax_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: `action=perseoquiz_get_symptoms&_ajax_nonce=${quiz_ajax_obj.nonce}`

    })
    
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then(symptoms => {
            symptoms.forEach(symptom => {
                const option = document.createElement("option");
                option.value = symptom.id;
                option.text = symptom.nome;
                symptomsDropdown.add(option);
            });
        })
        .catch(error => {
            console.error('Errore nella richiesta AJAX:', error);
        });
    // Aggiorna i sintomi selezionati
    function updateSelectedSymptoms() {
        Array.from(symptomsDropdown.selectedOptions).forEach((selectedOption) => {
            // Verifica se il sintomo è già stato aggiunto
            if (quizSelectedSymptoms.querySelector(`[data-id="${selectedOption.value}"]`)) {
                return;
            }
    
            const symptomDiv = document.createElement('div');
            symptomDiv.className = 'quiz-symptom';
            symptomDiv.setAttribute('data-id', selectedOption.value);
            symptomDiv.textContent = selectedOption.text;
    
            const removeButton = document.createElement('button');
            removeButton.className = 'quiz-symptom-remove';
            removeButton.textContent = 'x';
            removeButton.addEventListener('click', () => {
                selectedOption.selected = false;
                quizSelectedSymptoms.removeChild(symptomDiv);
            });
    
            symptomDiv.appendChild(removeButton);
            quizSelectedSymptoms.appendChild(symptomDiv);
        });
    }
    
    

    // Aggiungi questo event listener
    symptomsDropdown.addEventListener('change', () => {
        updateSelectedSymptoms();
    });
    
    


    // Aggiungi un event listener all'input di ricerca
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        function filterSymptoms(searchTerm) {
            let option;
            for (let i = 0; i < symptomsDropdown.options.length; i++) {
                option = symptomsDropdown.options[i];
                if (option.text.toLowerCase().indexOf(searchTerm) > -1) {
                    option.style.display = '';
                } else {
                    option.style.display = 'none';
                }
            }
        }
    });
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const searchTerm = event.target.value.toLowerCase();
    
            Array.from(symptomsDropdown.options).forEach(option => {
                const optionText = option.text.toLowerCase();
                if (optionText.includes(searchTerm)) {
                    option.selected = true;
                    updateSelectedSymptoms();
                    searchInput.value = '';
                }
            });
        }
    });
    
    



    // Passa alla sezione successiva quando si fa clic sul pulsante "AVANTI"
    quizNextBtn2.addEventListener('click', () => {
        describeSymptomsSection.style.display = 'none';
        quizSection3.style.display = 'block';
    });
});


