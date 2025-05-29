
// Fetch /api/boards into variable boardmetadata

let boardmetadata = {};

fetch('/api/boards')
    .then(response => response.json())
    .then(data => {
        boardmetadata = data;
        console.log(JSON.stringify(boardmetadata, null, 2));

        // Select Board to Show
        let select_html = '';
        select_html += '<select id="boardselection">';
        for (let board in boardmetadata) {
            select_html += `<option value="${board}">${boardmetadata[board].title}</option>`;
        }
        select_html += '</select>';
        document.getElementById('selectboard').innerHTML = select_html;

        // Show Competition Overview

        // Set overview div width
        document.getElementById('overview').style.width = '500px';

        let board = document.getElementById('boardselection').value;
        let meta_fields = {'name': 'Board ID', 
                            'title': 'Board Name', 
                            'desc': 'Description', 
                            'start': 'Start Time',
                            'end': 'End Time',
                            'status': 'Status',
                            'total_points': 'Total Points',
                            'assigned_points': 'Assigned Points',
                            'awarded_points': 'Awarded Points'
                        };

        let overview_html = '';

        // Bootstrap Table
        overview_html += '<table class="table table-striped table-hover table-sm">';
        for (let f in meta_fields) {
            overview_html += `<tr><td style="font-weight: bold;"">${meta_fields[f]}</td><td>${boardmetadata[board][f]}</td></tr>`;
        }
        overview_html += '</table>';
        document.getElementById('overview').innerHTML = overview_html;

        // Show Current Standings

        // Score Fields (Columns)
        let score_fields = {
            'player': 'Player'
        };
        // console.log(Object.keys(boardmetadata[board].stacks));
        for (s in boardmetadata[board].stacks) {
            score_fields[s.toLowerCase()] = s
        }
        // score_fields['total'] = 'Total';
        console.log(JSON.stringify(score_fields, null, 2));

        // Players
        // let players = Object.keys(boardmetadata[board].roles.players);
        let players = Object.values(boardmetadata[board].roles.players);        
        players.push('total');
        console.log(JSON.stringify(players, null, 2));

        // Generate Scores
        let scoreboard = {};

        for (let s in boardmetadata[board].stacks) {
            for (let p in players) {
                if (players[p] != 'total') {
                    // console.log('DEBUG: board: ' + board + ', player: ' + players[p] + ', stack: ' + s);
                    // console.log('DEBUG: points: ' + boardmetadata[board].stacks[s].points_assigned[players[p]]);
                    const points = boardmetadata[board].stacks[s].points_assigned[players[p]];

                    // Totals
                    if (scoreboard.hasOwnProperty('total') == false) {
                        scoreboard['total'] = {};
                    }
    
                    // Total Points
                    if (scoreboard['total'].hasOwnProperty(s) == false) {
                        scoreboard['total'][s] = 0;
                    }
                    scoreboard['total'][s] += points;
    
                    // Player
                    if (scoreboard.hasOwnProperty(players[p]) == false) {
                        scoreboard[players[p]] = {};
                    }
    
                    // Player Points
                    // scoreboard[players[p]][s] = boardmetadata[board].stacks[s].points_assigned[players[p]];
                    scoreboard[players[p]][s] = points;    
                }
            }
        }
        console.log(JSON.stringify(scoreboard, null, 2)); 
    
        
        let scores_html = '';
        scores_html += '<table class="table table-striped table-hover table-sm">';

        // Header Row
        scores_html += '<tr>';
        for (let s in score_fields) {
            scores_html += `<th>${score_fields[s]}</th>`;
        }
        scores_html += '</tr>';

        // scores_html += '<tr>';
        // for (let s in score_fields) {
        //     switch (s) {
        //         case 'player':
        //             scores_html += `<td>${boardmetadata[board].people[s]}</td>`;
        //             break;
        //         case 'total':
        //             scores_html += `<td>${boardmetadata[board].stacks[s]}</td>`;
        //             break;
        //         default:
        //             scores_html += `<td>${boardmetadata[board].stacks[s]}</td>`;
        //     }
        // }
        // scores_html += '</tr>';

        for (let p in players) {
            scores_html += '<tr>';
            scores_html += `<td>${players[p]}</td>`;
            for (let s in scoreboard[players[p]]) {
                scores_html += `<td>${scoreboard[players[p]][s]}</td>`;
            }
            scores_html += '</tr>';
        }

        scores_html += '</table>';
        document.getElementById('scores').innerHTML = scores_html;


    })
    .catch(error => {
        console.error('Error fetching board metadata:', error);
    });


