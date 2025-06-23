
// Fetch /api/boards into variable boardmetadata

let boardmetadata = {};

// fetch('/api/boards')
//     .then(response => response.json())
//     .then(data => {
//         boardmetadata = data;
//         // console.log(JSON.stringify(boardmetadata, null, 2));

//         // Select Board to Show
//         let select_html = '';
//         select_html += '<select id="boardselection" onchange="updateScoreboard()">';
//         for (let board in boardmetadata) {
//             select_html += `<option value="${board}">${boardmetadata[board].DESCRIPTION}</option>`;
//         }
//         select_html += '</select>';
//         document.getElementById('selectboard').innerHTML = select_html;
    
//         // Update Scoreboard
//         updateScoreboard();

//     })
//     .catch(error => {
//         console.error('Error fetching board metadata:', error);
//     });

    updateData(); // initial load
    setInterval(updateData, 30000); // periodic update
    

    function updateData() {
        console.log('Updating Scoreboard...');

        fetch('/api/boards')
            .then(response => response.json())
            .then(data => {
                boardmetadata = data;
    
                let select_html = '<select id="boardselection" onchange="updateScoreboard()">';
                for (let board in boardmetadata) {
                    select_html += `<option value="${board}">${boardmetadata[board].DESCRIPTION}</option>`;
                }
                select_html += '</select>';
                document.getElementById('selectboard').innerHTML = select_html;
    
                updateScoreboard();
            })
            .catch(error => {
                console.error('Error fetching board metadata:', error);
            });
    }

    function updateScoreboard() {
        // Get Selected Board
        const board = document.getElementById('boardselection').value;

        // Show Competition Overview

        // Set overview div width
        // document.getElementById('overview').style.width = '500px';
        // document.getElementById('roles').style.width = '500px';

        // let board = document.getElementById('boardselection').value;

        let meta_fields = {
                            'DESCRIPTION': 'Board Name', 
                            'NAME': 'Board ID', 
                            'START': 'Start Time',
                            'END': 'End Time',
                            'STATUS': 'Status'
                            // 'total_points': 'Total Points',
                            // 'assigned_points': 'Assigned Points',
                            // 'awarded_points': 'Awarded Points'
                        };

        let overview_html = '';

        // Bootstrap Table
        overview_html += '<h3>Competition Overview</h3>';
        overview_html += '<table class="table table-striped table-hover table-sm">';
        for (let f in meta_fields) {
            overview_html += `<tr><td style="font-weight: bold;"">${meta_fields[f]}</td><td>${boardmetadata[board][f]}</td></tr>`;
        }
        overview_html += '</table>';
        document.getElementById('overview').innerHTML = overview_html;

        // People and Roles
        // People | Role | Team
        let role_html = '';
        // Bootstrap Table
        role_html += '<h3>People and Roles</h3>';
        role_html += '<table class="table table-striped table-hover table-sm">';

        // console.log(JSON.stringify(boardmetadata[board].PEOPLE, null, 2));
        for (let p in boardmetadata[board].PEOPLE) {
            if (! boardmetadata[board].PEOPLE[p].hasOwnProperty('ROLE')) {
                boardmetadata[board].PEOPLE[p]['ROLE'] = 'Moderator';
            }

            if (! boardmetadata[board].PEOPLE[p].hasOwnProperty('TEAM')) {
                boardmetadata[board].PEOPLE[p]['TEAM'] = '';
            }

            let team_color = '#000';
            if (boardmetadata[board].PEOPLE[p].hasOwnProperty('TEAM_ID')) {
                team_color = '#' + boardmetadata[board].TEAMS[ boardmetadata[board].PEOPLE[p].TEAM_ID ].COLOR;
            } else {
                team_color = '#909';
            }

            role_html += `<tr><td>${boardmetadata[board].PEOPLE[p].NAME}</td><td><span style="color: ${team_color};">${boardmetadata[board].PEOPLE[p].ROLE}</span></td><td><span style="color: ${team_color};">${boardmetadata[board].PEOPLE[p].TEAM}</span></td></tr>`
        }

        role_html += '</table>';
        document.getElementById('roles').innerHTML = role_html;
    
        let scores_html = '';
        scores_html += '<h3 style="color: rgb(13 110,253);">' + boardmetadata[board].DESCRIPTION + '</h3>';


        // Score Totals
        scores_html += '<h4>Totals</h4>';
        scores_html += '<table class="table table-striped table-hover table-sm">';
    
        // Header Row
        scores_html += '<tr>';
        scores_html += '<th>Team</th>';
        for (let col in boardmetadata[board].STACKSLIST) {
            scores_html += `<th>${boardmetadata[board].STACKSLIST[col]}</th>`;
        }
        scores_html += '</tr>';

        // Convert Scores to Table Date
        let score_table = {};
        for (let stack in boardmetadata[board].SCORES.TEAMS.SUMMARY) {
            for (let team in boardmetadata[board].SCORES.TEAMS.SUMMARY[stack]) {
                let teamname = "<span style=\"color: #" + boardmetadata[board].TEAMS[ team ].COLOR + ";\">" + boardmetadata[board].TEAMS[ team ].NAME + "</span>";
                if (!score_table[teamname]) {
                    score_table[teamname] = {};
                }
                score_table[teamname][stack] = boardmetadata[board].SCORES.TEAMS.SUMMARY[stack][team];
            }
        }

        for (let rows in score_table) {
            scores_html += '<tr>';
            scores_html += `<td>${rows}</td>`;
            for (let col in boardmetadata[board].STACKSLIST) {
                scores_html += `<td>${score_table[rows][boardmetadata[board].STACKSLIST[col]]}</td>`;
            }
            scores_html += '</tr>';
        }

        scores_html += '</table>';

        // By Type
        scores_html += '<h4>By Type</h4>';
        scores_html += '<table class="table table-striped table-hover table-sm">';
    
        // Header Row
        scores_html += '<tr>';
        scores_html += '<th>Team</th>';
        for (let col in boardmetadata[board].LABELS) {
            scores_html += `<th><span style="color: #${boardmetadata[board].LABELS[col].color};">${col}</span></th>`;
        }
        scores_html += '</tr>';

        // Convert Scores to Table Date
        score_table = {};
        for (let type in boardmetadata[board].SCORES.TEAMS.BYTYPE) {
            for (let team in boardmetadata[board].SCORES.TEAMS.BYTYPE[type]) {
                let teamname = "<span style=\"color: #" + boardmetadata[board].TEAMS[ team ].COLOR + ";\">" + boardmetadata[board].TEAMS[ team ].NAME + "</span>";
                if (!score_table[teamname]) {
                    score_table[teamname] = {};
                }
                score_table[teamname][type] = boardmetadata[board].SCORES.TEAMS.BYTYPE[type][team];
            }
        }

        // console.log(JSON.stringify(score_table, null, 2));

        for (let rows in score_table) {
            scores_html += '<tr>';
            scores_html += `<td>${rows}</td>`;
            for (let col in boardmetadata[board].LABELS) {
                scores_html += `<td>${score_table[rows][col]}</td>`;
            }
            scores_html += '</tr>';
        }

        scores_html += '</table>';

        scores_html += '<hr>';
        // By Player
        scores_html += '<h4>By Player</h4>';
        scores_html += '<table class="table table-striped table-hover table-sm">';
    
        // Header Row
        scores_html += '<tr>';
        scores_html += '<th>Team</th>';
        scores_html += '<th>Player</th>';
        for (let col in boardmetadata[board].STACKSLIST) {
            scores_html += `<th>${boardmetadata[board].STACKSLIST[col]}</th>`;
        }
        scores_html += '</tr>';

        // Convert Scores to Table Date
        score_table = [];

        for (let stack in boardmetadata[board].SCORES.PLAYERS.SUMMARY) {
            for (let player in boardmetadata[board].SCORES.PLAYERS.SUMMARY[stack]) {
              let team = boardmetadata[board].PEOPLE[player].TEAM_ID;
              let team_color = boardmetadata[board].TEAMS[team].COLOR;
              let team_name = boardmetadata[board].TEAMS[team].NAME;
              let team_display = `<span style="color: #${team_color};">${team_name}</span>`;
              let player_name = boardmetadata[board].PEOPLE[player].NAME;
          
              // Find or create the entry
              let row = score_table.find(r => r.player === player_name);
              if (!row) {
                row = {
                  team: team_display,
                  player: player_name,
                };
                score_table.push(row);
              }
          
              row[stack] = boardmetadata[board].SCORES.PLAYERS.SUMMARY[stack][player];
            }
          }

        // console.log(JSON.stringify(score_table, null, 2));

        for (let row of score_table) {
            scores_html += `<tr><td>${row.team}</td><td>${row.player}</td>`;
            for (let col of boardmetadata[board].STACKSLIST) {
              scores_html += `<td>${row[col] ?? 0}</td>`;
            }
            scores_html += '</tr>';
        }

        // for (let rows in score_table) {
        //     scores_html += '<tr>';
        //     scores_html += `<td>${rows}</td>`;
        //     for (let col in boardmetadata[board].STACKSLIST) {
        //         scores_html += `<td>${score_table[rows][boardmetadata[board].STACKSLIST[col]]}</td>`;
        //     }
        //     scores_html += '</tr>';
        // }




        scores_html += '</table>';

        document.getElementById('scores').innerHTML = scores_html;

    
    }
    