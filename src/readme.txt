

1.The Syllabus Index & All class is loaded and also stored in IndexDb
=> All derived no need to be stored in indexdb

2.The meeting service is now offline stored and 5min or manul get from firestore

=> Effieicnant and try to use this offline data across app 
=> todo = gradual replace the usage and delete the meetings.service file and fully upgrade to global-meetings.service


3.There is inbuild dialog box
Usage: ConfirmService


4.IndexDb has function with ttl and not ttl so for now it is fine!! , later can upgrade all to use ttl




Todo
1.Replace syllabus store with syllabus-index service 
2.Similar to classdoc make all other as better service functions.
3.register/Signeup now => navigate to new page witjh paginated.
P.Rplace the syll lookup in class-details
4.Check user permission in firestore (points can be updated and read)
B.Some major issue with stream and not realtime classes on sidebar
B.Perormance improvement adn positining of syllabus-lookup service






//////////
Features of Us

Users for - free tagged online live classes !
Users for - rankboard ! (regular type)
Users bidaily - digest !


Feature v2
Yt content creator like camea and ambiesn for lerning



User-points :
I want index db storing and fetch once top 10 and put ttl on indexdb so that when ttl (2-3 days) 
is over the indexdb clears and its it time to fetch from remote and store to indexdb and there 
will be syncing shown in top of UI - is it good? - will this be available and not go off ? and 
also how much read will be there if i have 10000 users. So the user will be felt realtime,
when his gets higher as user's point will be live and users will be moved with 1.5 day static    

query - limit(10) orderBy('points', 'desc')

Reads per 10k users : 5k/day

Actual : 1.5 days


Sesonal points:
Store as number in indexDb and also max-20-30 min and on load if unpushed -> push 
So when user make write (learn), 1 session of 20-40 min or 1 hour then x 2 times day..
Writes per day = 2

Writes per 10k users : 20k/day

Requisites - 
Admin must change the meta/season so all users will update with fetch


ON load : 
Push unsynced data to remote like points



>>The Upgrade on Load Specific Class Data by Id
Delay make and init the loading - Feedback + initLoad()