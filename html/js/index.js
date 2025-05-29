
// Fetch /api/boards into variable boardmetadata

let boardmetadata = {};

fetch('/api/boards')
    .then(response => response.json())
    .then(data => {
        boardmetadata = data;
        // console.log(JSON.stringify(boardmetadata, null, 2));

        // Select Board to Show
        let select_html = '';
        select_html += '<select id="boardselection" onchange="updateScoreboard()">';
        for (let board in boardmetadata) {
            select_html += `<option value="${board}">${boardmetadata[board].title}</option>`;
        }
        select_html += '</select>';
        document.getElementById('selectboard').innerHTML = select_html;
    
        // Update Scoreboard
        updateScoreboard();

    })
    .catch(error => {
        console.error('Error fetching board metadata:', error);
    });


    function updateScoreboard() {
        // Get Selected Board
        const board = document.getElementById('boardselection').value;

        // Show Competition Overview

        // Set overview div width
        document.getElementById('overview').style.width = '500px';

        // let board = document.getElementById('boardselection').value;

        let meta_fields = {
                            'name': 'Board ID', 
                            'title': 'Board Name', 
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
        // console.log(JSON.stringify(score_fields, null, 2));

        // Players
        // let players = Object.keys(boardmetadata[board].roles.players);
        let players = Object.values(boardmetadata[board].roles.players);        
        players.push('total');
        // console.log(JSON.stringify(players, null, 2));

        // Generate Scores
        let scoreboard = {};

        for (let s in boardmetadata[board].stacks) {
            for (let p in players) {
                if (players[p] != 'total') {
                    // console.log('DEBUG: board: ' + board + ', player: ' + players[p] + ', stack: ' + s);
                    // console.log('DEBUG: points: ' + boardmetadata[board].stacks[s].points_assigned[players[p]]);
                    const points = boardmetadata[board].stacks[s].points_assigned[players[p]];

                    // Totals
                    if (scoreboard.hasOwnProperty('Total') == false) {
                        scoreboard['Total'] = {};
                    }
    
                    // Total Points
                    if (scoreboard['Total'].hasOwnProperty(s) == false) {
                        scoreboard['Total'][s] = 0;
                    }
    
                    // Player
                    if (scoreboard.hasOwnProperty(boardmetadata[board].people[ players[p] ].NAME) == false) {
                        // scoreboard[players[p]] = {};
                        scoreboard[ boardmetadata[board].people[ players[p] ].NAME ] = {};
                    }
    
                    // Player Points
                    // scoreboard[players[p]][s] = points;    
                    scoreboard[ boardmetadata[board].people[ players[p] ].NAME ][s] = points;
                }
            }
            scoreboard['Total'][s] += boardmetadata[board].stacks[s].points_total;
        }
        // console.log(JSON.stringify(scoreboard, null, 2)); 
    
        let scores_html = '';
        scores_html += '<h3 style="color: rgb(13 110,253);">' + boardmetadata[board].title + '</h3>';
        scores_html += '<table class="table table-striped table-hover table-sm">';
    
        // Header Row
        scores_html += '<tr>';
        for (let s in score_fields) {
            scores_html += `<th>${score_fields[s]}</th>`;
        }
        scores_html += '</tr>';
    
        // Player Rows
        for (let p in players) {
            // console.log(JSON.stringify(scoreboard[players[p]], null, 2));
            // console.log("DEBUG: Player: " + players[p]);
            // console.log(JSON.stringify(boardmetadata[board].people, null, 2));
            // console.log(JSON.stringify(boardmetadata[board].people[ players[p] ], null, 2));
            let player = 'Total';
            if (players[p] != 'total') {
                player = boardmetadata[board].people[ players[p] ].NAME;
            }
            // console.log("DEBUG: Player: " + player);

            scores_html += '<tr>';
            switch (player) {
                case 'Total':
                    scores_html += `<td style="font-weight: bold; color: rgb(13 110,253);">${player}</td>`;
                    break;
                default:
                    scores_html += `<td>${player}</td>`;
                    break;
            }

            for (let s in scoreboard[player]) {
                switch (player) {
                    case 'Total':
                        scores_html += `<td style="font-weight: bold; color: rgb(13 110,253);">${scoreboard[player][s]}</td>`;
                        break;
                    default:
                        scores_html += `<td>${scoreboard[player][s]}</td>`;
                        break;
                }
            }
            scores_html += '</tr>';
        }
    
        scores_html += '</table>';
        document.getElementById('scores').innerHTML = scores_html;
    }
    