Introduction


****************************
FIRESTORE DATABASE RULES
****************************
rules_version = '2';
//from original but waste comments removed 
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
    //modified only allow paid cust in
    //change to original when site ready for launch
            allow read: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.plan != null 
     allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.plan != null
   }
  }
}
****************************
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // This rule locks fully open for testing
    // This rule locks everyone out or not
    match /{document=**} {
            allow read, update, write: if true;
      		
    }
  }
}
****************************
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      //from original but waste comments removed 
            allow read, update, write: if true;
      			allow create, update, delete, write: if request.auth != null;
    }
  }
}
****************************
service cloud.firestore {
  match /databases/{database}/documents {
      //Im not sure what this would help with, kept anyway
      allow read, write: if request.auth.uid != null;
    }
  }

****************************
REALTIME DATABASE RULES
****************************
{
"rules": {
".read": true,
".write": true
}
}