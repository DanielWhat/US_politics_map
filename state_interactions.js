class Candidate {
    constructor (name, colour, delegates=0) {
        this.name = name;
        this.colour = colour;
        this.delegates = delegates;
    }
}


class State {
    constructor (id, name, delegates, primary_type, colour="#cccccc", results={}, delegate_results={}) {
        this.id = id;
        this.name = name;
        this.delegates = delegates;
        this.primary_type = primary_type;
        this.colour = colour;
        this.results = results;
        this.delegate_results = delegate_results;
    }
}


const map_state = {
    currently_selected_state: "None",
};


let states_dict = {
    "AL": new State("AL", "Alabama", 52, "Open primary"), 
    "AK": new State("AK", "Alaska", 14, "Closed caucus"), 
    "AS": new State("AS", "American Samoa", 6, "Closed caucus"),
    "AZ": new State("AZ", "Arizona", 67, "Closed primary"), 
    "AR": new State("AR", "Arkansas", 31, "Open primary"),
    "CA": new State("CA", "California", 416, "Semi-closed primary"),
    "CO": new State("CO", "Colorado", 67, "Closed caucus"),
    "CT": new State("CT", "Connecticut", 49, "Closed primary"),
    "DE": new State("DE", "Delaware", 17, "Closed primary"),
    "DA": new State("DA", "Democrats Abroad", 13, "Closed primary"),
    "DC": new State("DC", "District of Columbia", 17, "Closed primary"),
    "FL": new State("FL", "Florida", 219, "Closed primary"),
    "GA": new State("GA", "Georgia", 105, "Open primary"),
    "GU": new State("GU", "Guam", 6,"Closed caucus"),
    "HI": new State("HI", "Hawaii", 22, "Semi-closed caucus"),
    "ID": new State("ID", "Idaho", 20, "Open caucus"),
    "IL": new State("IL", "Illinois", 155, "Open primary"),
    "IN": new State("IN", "Indiana", 70, "Open primary"),
    "IA": new State("IA", "Iowa", 41, "Semi-open caucus"),
    "KS": new State("KS", "Kansas", 33, "Closed caucus"),
    "KY": new State("KY", "Kentucky", 46, "Closed primary"),
    "LA": new State("LA", "Louisiana", 50, "Closed primary"),
    "ME": new State("ME", "Maine", 24, "Closed caucus"),
    "MD": new State("MD", "Maryland", 79, "Closed primary"),
    "MA": new State("MA", "Massachusetts", 91, "Semi-closed primary"),
    "MI": new State("MI", "Michigan", 125, "Open primary"),
    "MN": new State("MN", "Minnesota", 75, "Open caucus"),
    "MS": new State("MS", "Mississippi", 36, "Open primary"),
    "MO": new State("MO", "Missouri", 68, "Open primary"),
    "MT": new State("MT", "Montana", 16, "Open primary"),
    "NE": new State("NE", "Nebraska", 25, "Closed caucus"),
    "NV": new State("NV", "Nevada", 36, "Closed caucus"),
    "NH": new State("NH", "New Hamshire", 24, "Semi-closed primary"),
    "NJ": new State("NJ", "New Jersey", 107, "Semi-closed primary"),
    "NM": new State("NM", "New Mexico", 29, "Closed primary"),
    "NY": new State("NY", "New York", 224, "Closed primary"),
    "NC": new State("NC", "North Carolina", 110, "Semi-closed primary"),
    "ND": new State("ND", "North Dakota", 14, "Open caucus"),
    "MP": new State("MP", "Northern Marianas", 6, "Closed caucus"),
    "OH": new State("OH", "Ohio", 136, "Semi-open primary"),
    "OK": new State("OK", "Oklahoma", 37, "Semi-closed primary"),
    "OR": new State("OR", "Oregon", 52, "Closed primary"),
    "PA": new State("PA", "Pennsylvania", 153, "Closed primary"),
    "PR": new State("PR", "Puerto Rico", 51, "Open primary"),
    "RI": new State("RI", "Rhode Island", 31, "Semi-closed primary"),
    "SC": new State("SC", "South Carolina", 54, "Open primary"),
    "SD": new State("SD", "South Dakota", 14, "Semi-closed primary"),
    "TN": new State("TN", "Tennessee", 64, "Open primary"),
    "TX": new State("TX", "Texas", 228, "Open primary"),
    "UT": new State("UT", "Utah", 29, "Semi-open caucus"),
    "VT": new State("VT", "Vermont", 16, "Open primary"),
    "VI": new State("VI", "Virgin Islands", 6, "Closed caucus"),
    "VA": new State("VA", "Virginia", 99, "Open primary"),
    "WA": new State("WA", "Washington", 89, "Open caucus"),
    "WV": new State("WV", "West Virginia", 24, "Semi-closed primary"),
    "WI": new State("WI", "Wisconsin", 77, "Open primary"),
    "WY": new State("WY", "Wyoming", 13, "Closed caucus"),
};


let candidates_list = [];


function load_map_data(data, url) {
    
    candidates_list = data['candidates'];
    states_dict = data['states'];
    
    let states_keys = Object.keys(states_dict);
    for (let i = 0; i < states_keys.length; i++) {
        let state_element = document.getElementById(states_keys[i]);
        state_element.style.fill = states_dict[states_keys[i]].colour;
    }
    
    document.getElementById('share-link').innerHTML = `<p class="body-text shareable-text">Your sharable link is: <a href="${window.location.href}">${window.location.href}</a></p>`;
    
    refresh_candidates();
}



function load_map() {
    /* Loads a preset map */
    
    let url = get_map_json_url();
    
    if (url !== null) {
        
        fetch(url)
            .then((res) => {return res.json()})
            .then((data) => {load_map_data(data)})
    }
}


function get_map_json_url () {
    const url_variables = new URLSearchParams(window.location.search);
    const code = url_variables.get('code');
    if (code !== null) {
        return`./maps/${code}.json`;
    } else {
        return null;
    }
}


function get_map_json_str () {
    let data = {'candidates': candidates_list, 'states': states_dict};
    return JSON.stringify(data);
}





function display_state_data(event) {
    /*Displays the data for a state when a state is clicked*/
    
    let new_state = document.getElementById(event.target.id);
    let old_state = document.getElementById(map_state.currently_selected_state);
    
    new_state.style.opacity = "0.5";
    
    if (old_state !== null) { /* If we had clicked on a state previously */
        old_state.style.opacity = ""; /* This takes it back to the default opacity specified in the css */
    }
    
    map_state.currently_selected_state = event.target.id;
    
    if (old_state !== null && old_state.id === new_state.id) { /* user has clicked on the same state twice */
        new_state.style.opacity = ""; /* deselect the state */
        map_state.currently_selected_state = "None";
    }
    
    refresh_state_data();   
}



function open_add_candidate() {
    /* Opens the add_candidate dialogue box */
    
    let display_div = document.getElementById('add-candidate-popup');
    display_div.style.display = "inherit";
    close_remove_candidate(); /* Close remove candidate if it's open */
}



function close_add_candidate() {
    /* Closes the add_candidate dialogue box */
    
    let display_div = document.getElementById('add-candidate-popup');
    display_div.style.display = "none";
}



function open_remove_candidate() {
    let display_div = document.getElementById('remove-candidate-popup');
    display_div.style.display = "inherit";
    close_add_candidate(); /* Close add candidate box if it's open */
}



function close_remove_candidate() {
    
    let display_div = document.getElementById('remove-candidate-popup');
    display_div.style.display = "none";
}



function set_form_add_event_handler() {
    document.getElementById('state-results-form').addEventListener('input', function (e) {
        let form = document.getElementById('state-results-form');
        let unallocated_note = document.getElementById('unallocated-note');
        let allocated_percent = 0;
        
        for(let i = 0; i < form.elements.length; i++) {
            if (form.elements[i].type === "number") {
                allocated_percent += (form.elements[i].value !== "") ? parseFloat(form.elements[i].value) : 0;
            }
        }
        
        unallocated_note.innerHTML = `${100 - allocated_percent}% of the vote is unallocated`;
    });
}



function refresh_state_data() {
    
    let state_info = document.getElementById('state-info');
    let state = states_dict[map_state.currently_selected_state];
    let state_html = "";
    
    if (map_state.currently_selected_state === "None") { /* the user has no state selected currently */
        state_info.innerHTML = '<h1 class="title-text state-title">Click on a state to see info</h1><form id="state-results-form"></form>';
        return 0; /* exit the function */
    }
    
    state_html = `<h1 class="title-text state-title">${state.name} - ${state.id}</h1>
                  <p class="body-text">Primary Type: ${state.primary_type}</p>
                  <p class="body-text">Pledged Delegates: ${state.delegates}</p>`;
    
    state_html += "<form id='state-results-form' onsubmit='state_results_handler(event)'><p class='body-text'>State results: </p><ul>";
    
    if (candidates_list.length === 0) {
        state_html += '<p class="body-text">You need to add candidates before you can enter results.</p>';
    }
    
    let allocated_percent = 0;
    
    for (let i = 0; i < candidates_list.length; i++) {
        /* Value is 0 by default, but otherwise make it equal to what % we have recorded for that candidate */
        let value = (Object.keys(states_dict[state.id].results).length === 0) ? 0 : states_dict[state.id].results[candidates_list[i].name]; 
        allocated_percent += value;
        
        state_html += `<li><p class="body-text">${candidates_list[i].name}: <input class="candidate-percentage-input" type="number" min="0" max="100" value="${value}" name="${candidates_list[i].name}" step="0.1" required> %</p></li>`
    }
    
    state_html += `</ul><div class='bottom-state-box'><p class='body-text note-text' id='unallocated-note'>${100 - allocated_percent}% of the vote is unallocated</p><button class='submit-button submit-results' type='submit'>Confirm Results</button></div></form>`;
    state_info.innerHTML = state_html;
    
    set_form_add_event_handler();
}



function refresh_candidates() {
    /* Refreshes/updates the candidates wherever they are displayed */
    
    let ul_of_candidates = document.getElementById('list-of-candidates');
    let ul_candidates_to_remove = document.querySelector('.remove-candidates-list');
    ul_of_candidates.innerHTML = ul_candidates_to_remove.innerHTML = "";
    
    if (candidates_list.length === 0) {
        ul_of_candidates.innerHTML = "<p class='body-text'>Please add a candidate</p>";
        ul_candidates_to_remove.innerHTML = "<p class='body-text'>Error: You need to add a candidate before you can remove a candidate.</p>"
    }
    
    for (let i = 0; i < candidates_list.length; i++) {
        ul_of_candidates.innerHTML += `<li><div style="background-color: ${candidates_list[i].colour};" class="colour-div"></div><p class="body-text candidate-name">${candidates_list[i].name} (${candidates_list[i].delegates})</p></li>`;
        ul_candidates_to_remove.innerHTML += `<li><label><p class="body-text"><input type="checkbox" name="candidates" value="${candidates_list[i].name}"> ${candidates_list[i].name}</p></label></li>`;
    }
    
    refresh_state_data();     
}



function remove_candidates(candidate_names) {
    /* Takes a list of candidate names and removes them from candidates list, and removes them from any state results*/
    
    /*remove them from the results of the states*/
    const state_keys = Object.keys(states_dict);
    
    for (let i = 0; i < candidate_names.length; i++) {
        let candidate = candidates_list.find((candidate_obj) => {return candidate_names[i] === candidate_obj.name;});
        
        for (let j = 0; j < state_keys.length; j++) {
            /* Remove the cendidate from the state results */
            let state = states_dict[state_keys[j]];
            let state_results = state.results;
            delete state_results[candidate_names[i]];
            
            /*If the candidate "won" a state, change the state colour to back to default*/
            let state_element = document.getElementById(state.id);

            if (state_element.style.fill === candidate.colour) {
                state_element.style.fill = "#cccccc";
                state.colour = "#cccccc";
            }
        }
    }
    
    candidates_list = candidates_list.filter(function (candidate) {
        return !candidate_names.includes(candidate.name);
    });
}



function retabulate_percentages(results_list) {
    /* Takes a list of ["Candidate Name", Percentage] and: adjusts the percentage if all percentages do not add to 100
       and turns all percentages into decimal percentages. Returns a new list with these contidions */
    
    let running_sum_of_percent = 0;
    
    for (let i = 0; i < results_list.length; i++) {
        running_sum_of_percent += results_list[i][1];
    }
        
    for (i = 0; i < results_list.length; i++) {
        results_list[i][1] = (results_list[i][1] / running_sum_of_percent) || 0; 
    }
    
    return results_list;
}



function get_none_at_threshold_results(state_results) {
    
    let largest_percent = 0;
    for (let i = 0; i < candidates_list.length; i++) {
        if (state_results[candidates_list[i].name] > largest_percent) {
            largest_percent = state_results[candidates_list[i].name];   
        }
    }
    
    let results_list = Object.entries(state_results).filter(function (candidate_result) {
        return candidate_result[1] >= (largest_percent - 10);
    });
    
    return results_list;
}



function update_delegate_count(state) {
    /* Implements the democratic algorithm for calculating delegate rationing
       Indepth explanation here http://www.thegreenpapers.com/P20/D-Math.phtml*/
    
    let results_list = Object.entries(state.results).filter(function (candidate_result) {
        return candidate_result[1] >= 15;
    });
    
    /* No single candidate has 15% */
    if (results_list.length === 0) {
        results_list = get_none_at_threshold_results(state.results);
    }
    
    console.log(results_list);
    
    results_list = retabulate_percentages(results_list);
    
    console.log(results_list);
    
    let results_remainders = [];
    /* Now the second entry in the results_list will be the estimate delegate count for that candidate */
    for (let i = 0; i < results_list.length; i++) {
        let remainder = results_list[i][1] * state.delegates - Math.floor(results_list[i][1] * state.delegates);
        results_remainders.push([results_list[i][0], remainder]);
        
        results_list[i][1] = Math.floor(results_list[i][1] * state.delegates); 
    }
    
    let delegates_apportioned = 0;
    results_remainders.sort((remainder_a, remainder_b) => {
        return remainder_b[1] - remainder_a[1];
    });
    
    /* Add the delegates earned to each candidate in the candidates_list */
    for (i = 0; i < results_list.length; i++) {
        let index = candidates_list.findIndex((candidate) => {
            return candidate.name === results_list[i][0]
        });
        
        delegates_apportioned += results_list[i][1];
        candidates_list[index].delegates += results_list[i][1];
        state.delegate_results[candidates_list[index].name] = results_list[i][1];
    }
    
    /* Some times there are delegates remaining, award them to those with the highest remainder */
    while (delegates_apportioned < state.delegates) {
        let index = candidates_list.findIndex((candidate) => {
            return candidate.name === results_remainders[0][0]
        });
        
        candidates_list[index].delegates++;
        state.delegate_results[candidates_list[index].name]++;
        delegates_apportioned++;
        results_remainders.shift();
    }
}


function remove_old_delegate_count(delegate_results_dict) {
    /* Takes the old delegate_results for a state, and removes them from the candidates' delegate counts*/
    
    for (let i = 0; i < candidates_list.length; i++) {
        candidates_list[i].delegates -= delegate_results_dict[candidates_list[i].name] || 0;
    }    
}



function record_state_results(results_dict) {
    
    remove_old_delegate_count(states_dict[map_state.currently_selected_state].delegate_results);
    
    states_dict[map_state.currently_selected_state].results = results_dict;
    let results_array = Object.entries(results_dict);
    
    results_array = results_array.sort(function (item_a, item_b) {
        return item_a[1] - item_b[1];
    });
    
    let top_candidate_name = results_array[candidates_list.length - 1][0];
    let top_candidate = candidates_list.find((candidate) => {return candidate.name === top_candidate_name;});
    let state = document.getElementById(map_state.currently_selected_state);
    state.style.fill = top_candidate.colour;
    states_dict[map_state.currently_selected_state].colour = top_candidate.colour;
    
    update_delegate_count(states_dict[map_state.currently_selected_state]);
}



function results_str_to_float(results_dict) {
    for (let i = 0; i < candidates_list.length; i++) {
        results_dict[candidates_list[i].name] = parseFloat(results_dict[candidates_list[i].name]);
    }
    return results_dict;
}



function state_results_handler(e) {
    e.preventDefault();
    
    /*The map has now changed so the share link must be removed*/
    document.getElementById('share-link').innerHTML = "";
    
    let results_dict = {};
    
    for (let i = 0; i < candidates_list.length; i++) {
        results_dict[candidates_list[i].name] = e.target.elements[candidates_list[i].name].value;
    }
    
    results_dict = results_str_to_float(results_dict);
    
    if (Object.keys(results_dict).length !== 0) {
        record_state_results(results_dict);
    }
    refresh_candidates();
}



document.getElementById('add-candidate-form').addEventListener('submit', function (e) {
    e.preventDefault();
    
    /*The map has now changed so the share link must be removed*/
    document.getElementById('share-link').innerHTML = "";
    
    let name = e.target.elements.candidate_name.value;
    let colour = e.target.elements.colour.value;
    let new_candidate = new Candidate(name, colour);
    candidates_list.push(new_candidate);
    e.target.reset();
    refresh_candidates();
});



document.getElementById('remove-candidate-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    /*The map has now changed so the share link must be removed*/
    document.getElementById('share-link').innerHTML = "";
    /*<p class="body-text shareable-text">Your sharable link is: <a href="http://danielwhat.tk/usa/index.html?code=432fcabf2ba6f67847145bb29bcc0ab7">http://danielwhat.tk/usa/index.html?code=432fcabf2ba6f67847145bb29bcc0ab7</a></p>*/
    
    let candidate_names_to_remove = [];
    
    if (e.target.elements.candidates === undefined) { /* prevent the function from running if someone submits without any candidates */
        
        return 0;
    } else if (e.target.elements.candidates.length === undefined) {
        
        candidate_names_to_remove.push(e.target.elements.candidates.value);
    } else {
        
        e.target.elements.candidates.forEach(function (candidate) {
            if (candidate.checked) {
                candidate_names_to_remove.push(candidate.value);
            }
        });
    }
    
    remove_candidates(candidate_names_to_remove);
    refresh_candidates();
});

document.getElementById('save-map-form').addEventListener('submit', function(e) {
    e.target.elements.data.value = JSON.stringify({'candidates': candidates_list, 'states': states_dict});
});

load_map();

