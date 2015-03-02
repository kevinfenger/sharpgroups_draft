'use strict'; 

angular.module('drafts').config(['$stateProvider',  
        function($stateProvider) { 
             $stateProvider.
             state('createDraft', { 
                 url: '/drafts/create',
                 templateUrl: 'modules/drafts/views/create-draft.client.view.html'  
             }).  
             state('joinDraft', { 
                 url: '/drafts/join',
                 templateUrl: 'modules/drafts/views/join-draft.client.view.html'  
             }). 
             state('myDrafts', { 
                 url: '/drafts/mine',
                 templateUrl: 'modules/drafts/views/my-drafts.client.view.html'  
             }).  
             state('enterDraft', {
	         url: '/drafts/:draftId',
		 templateUrl: 'modules/drafts/views/draft.client.view.html',
                 controller: 'AuctionController',
                 resolve: { 
                    draft: function($stateParams,Drafts) { 
                        return Drafts.get({draftId : $stateParams.draftId}).$promise; 
                    } 
                 }
	     });
        }
]); 
