package config

import (
	"context"
	"log"
	"os"
	"errors"
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

	log.Println("Firebase JSON length:", len(credentialsJSON))
	log.Println("Firebase File:", credentialsFile)

	if credentialsJSON == "" && credentialsFile == "" {
		log.Fatal("FIREBASE_CREDENTIALS_JSON or FIREBASE_CREDENTIALS_FILE must be set")
	}

	var opt option.ClientOption
	if credentialsJSON != "" {
		log.Println("Using FIREBASE_CREDENTIALS_JSON")
		opt = option.WithCredentialsJSON([]byte(credentialsJSON))
	} else {
		log.Println("Using FIREBASE_CREDENTIALS_FILE")
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
		log.Println("FirebaseApp is nil")
		return nil, errors.New("firebase app nil")
	}

	firebaseAuthOnce.Do(func() {
		log.Println("Creating Firebase Auth client...")
		firebaseAuthClient, firebaseAuthErr = FirebaseApp.Auth(context.Background())

		if firebaseAuthErr != nil {
			log.Println("Firebase Auth error:", firebaseAuthErr)
		}

		if firebaseAuthClient == nil {
			log.Println("Firebase Auth client is nil")
		}
	})

	return firebaseAuthClient, firebaseAuthErr
}
