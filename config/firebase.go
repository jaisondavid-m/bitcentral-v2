package config

import (
	"context"
	"log"
	"os"
	"sync"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"google.golang.org/api/option"
)

var FirebaseApp *firebase.App
var (
	firebaseAuthClient *auth.Client
	firebaseAuthOnce   sync.Once
	firebaseAuthErr    error
)

func InitFirebase() {
	credentialsJSON := os.Getenv("FIREBASE_CREDENTIALS_JSON")
	credentialsFile := os.Getenv("FIREBASE_CREDENTIALS_FILE")

	if credentialsJSON == "" && credentialsFile == "" {
		log.Fatal("FIREBASE_CREDENTIALS_JSON or FIREBASE_CREDENTIALS_FILE must be set")
	}

	var opt option.ClientOption
	if credentialsJSON != "" {
		opt = option.WithCredentialsJSON([]byte(credentialsJSON))
	} else {
		opt = option.WithCredentialsFile(credentialsFile)
	}

	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatalf("Firebase init error: %v", err)
	}

	FirebaseApp = app
	log.Println("✅ Firebase initialized successfully")
}

func FirebaseAuthClient() (*auth.Client, error) {
	if FirebaseApp == nil {
		return nil, nil
	}

	firebaseAuthOnce.Do(func() {
		firebaseAuthClient, firebaseAuthErr = FirebaseApp.Auth(context.Background())
	})

	return firebaseAuthClient, firebaseAuthErr
}
