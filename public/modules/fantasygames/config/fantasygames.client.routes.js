'use strict'; 

angular.module('drafts').config(['$stateProvider',  
        function($stateProvider) { 
             $stateProvider.
             state('createFantasyGame', { 
                 url: '/fantasygames/create',
                 templateUrl: 'modules/fantasygames/views/create-fantasygame.client.view.html'  
             }).  
             state('joinFantasyGame', { 
                 url: '/fantasygames/join',
                 templateUrl: 'modules/fantasygames/views/join-fantasygame.client.view.html'  
             }). 
             state('myFantasyGames', { 
                 url: '/fantasygames/mine',
                 templateUrl: 'modules/fantasygames/views/my-fantasygames.client.view.html'  
             }); 
        }
]); 
