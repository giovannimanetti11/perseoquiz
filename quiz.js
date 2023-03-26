document.addEventListener("DOMContentLoaded", function () {

    // DEFINISCE VARIABILI
    const openQuizBtn = document.getElementById("open-quiz-btn");
    const quizPopup = document.getElementById("quiz-popup");
    const personalDataSection = document.getElementById("quiz-section-personal-data");
    const describeSymptomsSection = document.getElementById("quiz-section-describe-symptoms");
    const quizNextBtn2 = document.getElementById("quiz-next-btn-2");
    const quizBackBtn2 = document.getElementById("quiz-back-btn-2");
    const quizSelectedSymptoms = document.getElementById("quiz-selected-symptoms");
    const symptomsDropdown = document.getElementById("quiz-symptoms-dropdown");
    const searchInput = document.getElementById('quiz-symptoms-search');
    const quizSectionRemedies = document.getElementById("quiz-section-remedies");
    const quizPopupContent = document.getElementById("quiz-popup-content");


    // AVVIA IL POPUP CLICCANDO IL PULSANTE "APRI IL QUIZ"
    openQuizBtn.addEventListener("click", function () {
        quizPopup.style.display = "block";
    });

    // CHIUDE IL POPUP CLICCANDO X
    const quizCloseBtn = document.getElementById("quiz-close-btn");
    quizCloseBtn.addEventListener("click", function () {
        quizPopup.style.display = "none";
    });


    // AGGIUNGE UN LISTENER SULLO SFONDO DEL POPUP
    quizPopup.addEventListener("click", function (event) {
        // SE L'ELEMENTO CLICCATO È LO SFONDO DEL POPUP (E NON IL CONTENUTO DEL POPUP O UN ELEMENTO ALL'INTERNO DI ESSO)
        if (event.target === quizPopup) {
            quizPopup.style.display = "none";
        }
    });


    // CONTENUTO "DATI PERSONALI"
    personalDataSection.innerHTML = `
        <h3>Dati personali</h3>
        <p>Per favore, compila i campi sottostanti per fornirti un'informazione più personalizzata.</p>
        <div class="form-row">
            <input type="text" id="quiz-name" name="quiz-name" placeholder="Nome" required>
            <select id="quiz-age-range" name="quiz-age-range">
                <option selected>Fascia d'età</option>
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
    

    // CONTROLLO SUI CAMPI PRIMA DI PASSARE ALLA SEZIONE SUCCESSIVA CLICCANDO "AVANTI"
    nextBtn.addEventListener("click", function () {
        const quizName = document.getElementById("quiz-name");
        const quizAgeRange = document.getElementById("quiz-age-range");
        const quizEmail = document.getElementById("quiz-email");
        const quizGender = document.getElementById("quiz-gender");
        
        
        const errorDiv = personalDataSection.querySelector('.alert-danger');
        if (errorDiv) errorDiv.remove();
        
        let errorMessage = "";
        
        if (!quizName.value || !quizAgeRange.value || !quizEmail.value || !quizGender.value) {
            errorMessage = "Per favore inserisci tutti i campi";
        }
        
        if (!isValidEmail(quizEmail.value)) {
            errorMessage = "Inserisci un indirizzo email valido";
        }
        
        if (errorMessage !== "") {
            const errorDiv = document.createElement("div");
            errorDiv.classList.add("alert", "alert-danger");
            errorDiv.role = "alert";
            errorDiv.innerHTML = `
            <p>${errorMessage}</p>
            `;
        
            personalDataSection.insertBefore(errorDiv, nextBtn);
            return;
        }
        
        personalDataSection.style.display = "none";
        describeSymptomsSection.style.display = "block";
    });

    // AGGIUNGE UN CONTROLLO SUL TASTO INVIO, SE VIENE PREMUTO SI TRIGGERA IL PULSANTE "AVANTI"
    document.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            
            // Usa getComputedStyle invece di style.display
            if (getComputedStyle(personalDataSection).display === "block") {
                nextBtn.click();
            } else if (getComputedStyle(describeSymptomsSection).display === "block") {
                if (Array.from(quizSelectedSymptoms.children).length === 0) {
                    alert('Seleziona almeno un sintomo prima di procedere.');
                } else {
                    quizNextBtn2.click();
                }                
            }
        }
    });
    

    
    // AGGIUNGE UN CONTROLLO ESSENZIALE SULLA VALIDITA' DELL'EMAIL
    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
        
        
    // VA ALLA SEZIONE PRECEDENTE CLICCANDO "INDIETRO"
    quizBackBtn2.addEventListener("click", function () {
        describeSymptomsSection.style.display = "none";
        personalDataSection.style.display = "block";
    });

    // CARICA I SINTOMI DAL DB E LI AGGIUNGE AL DROPDOWN
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
            // Ordina l'array dei sintomi in ordine alfabetico
            symptoms.sort((a, b) => a.nome.localeCompare(b.nome));
        
            // Crea e aggiunge gli elementi <option> al dropdown
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

    // AGGIORNA I SINTOMI
    function updateSelectedSymptoms() {
        Array.from(symptomsDropdown.selectedOptions).forEach((selectedOption) => {
            // VERIFICA CHE IL SINTOMO SIA STATO AGGIUNTO
            if (quizSelectedSymptoms.querySelector(`[data-id="${selectedOption.value}"]`)) {
                return;
            }

            const symptomDiv = document.createElement('div');
            symptomDiv.className = 'quiz-symptom';
            symptomDiv.setAttribute('data-id', selectedOption.value);
            symptomDiv.textContent = selectedOption.text;

            const removeButton = document.createElement('button');
            removeButton.className = 'quiz-symptom-remove';
            removeButton.innerHTML = '<i class="fa fa-times"></i>';
            removeButton.addEventListener('click', () => {
                selectedOption.selected = false;
                quizSelectedSymptoms.removeChild(symptomDiv);
            });

            symptomDiv.appendChild(removeButton);

            // INSERISCE IL SINTOMO IN ORDINE ALFABETICO
            let inserted = false;
            Array.from(quizSelectedSymptoms.children).some(child => {
                if (child.textContent.localeCompare(selectedOption.text) > 0) {
                    quizSelectedSymptoms.insertBefore(symptomDiv, child);
                    inserted = true;
                    return true;
                }
                return false;
            });

            if (!inserted) {
                quizSelectedSymptoms.appendChild(symptomDiv);
            }
        });
    }


    symptomsDropdown.addEventListener('change', () => {
        updateSelectedSymptoms();
    });


    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        filterSymptoms(searchTerm);
    });
    
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

    

    // RICHIESTA AJAX PER TROVARE ERBE CORRISPONDENTI E PASSA ALLA SEZIONE SUCCESSIVA CLICCANDO "AVANTI"
    quizNextBtn2.addEventListener('click', () => {
        // ARRAY SINTOMI SELEZIONATI
        const selectedSymptomIds = Array.from(quizSelectedSymptoms.children)
            .map(symptomDiv => parseInt(symptomDiv.getAttribute('data-id')));


        describeSymptomsSection.style.display = "none";
        quizSectionRemedies.style.display = "block";

        fetch(quiz_ajax_obj.ajax_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: `action=perseoquiz_get_herbs_by_symptoms&_ajax_nonce=${quiz_ajax_obj.nonce}&symptom_ids=${selectedSymptomIds.join(',')}`
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const herbs = Object.values(data.data); 
                let herbsList = '';
        
                herbs.forEach(herb => {
                    const thumbnail = herb.thumbnail || '/path/to/default/thumbnail.png';
                    const scientificName = herb.meta_box && herb.meta_box.nome_scientifico ? herb.meta_box.nome_scientifico : 'N/A';
                    herbsList += `
                        <div class="quiz-herb">
                            <img src="${thumbnail}" alt="${herb.title}">
                            <h4 class="card-title">${herb.title}</h4>
                            <p class="card-scientific-name">${herb.scientific_name}</p>
                            <a href="${herb.guid}" target="_blank" class="btn-card">Apri Scheda</a>
                        </div>
                    `;
                });

                const selectedSymptoms = Array.from(quizSelectedSymptoms.children).map(symptomDiv => symptomDiv.textContent);
                const formattedSymptoms = selectedSymptoms.join(", ");

        
                quizSectionRemedies.innerHTML = `
                    <h3>Erbe che potrebbero rivelarsi utili contro:</h3>
                    <h4><strong>${formattedSymptoms}</strong></h4>
                    <div class="quiz-herbs-grid">${herbsList}</div>
                    <button id="quiz-back-btn-3" class="btn btn-danger">INDIETRO</button>
                `;

        
                describeSymptomsSection.style.display = 'none';
                quizSectionRemedies.style.display = 'block';

                const quizBackBtn3 = document.getElementById('quiz-back-btn-3');
                quizBackBtn3.addEventListener('click', function () {
                    quizSectionRemedies.style.display = 'none';
                    describeSymptomsSection.style.display = 'block';
                });

            } else {
                console.error('Errore nella richiesta AJAX:', data.data);
            }
        })
        
        
        .catch(error => {
            console.error('Errore nella richiesta AJAX:', error);
        });

        
    });
});


