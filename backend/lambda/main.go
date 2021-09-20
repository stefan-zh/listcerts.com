package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"net/http"
)

type Request events.APIGatewayProxyRequest
type Response events.APIGatewayProxyResponse

type DomainRequest struct {
	Domain string `json:"domain"`
}

type CertsResponse struct {
	Certs []Certificate `json:"certs"`
}

func HandleRequest(_ context.Context, req Request) (Response, error) {
	var domReq DomainRequest
	err := json.Unmarshal([]byte(req.Body), &domReq)
	if err != nil {
		return Response{StatusCode: 400, Body: fmt.Sprintf("Request %+v cannot be parsed because of: %s", req, err.Error())}, nil
	}
	client := &http.Client{}
	domainResp, err := client.Get(domReq.Domain)
	if err != nil {
		return Response{StatusCode: 404, Body: err.Error()}, nil
	}
	resp := CertsResponse{Certs: []Certificate{}}
	for _, chain := range domainResp.TLS.VerifiedChains {
		for _, cert := range chain {
			c := ParseCertificate(cert)
			resp.Certs = append(resp.Certs, *c)
		}
	}
	certsJson, _ := json.Marshal(resp)
	return Response{
		StatusCode: 200,
		Body:       string(certsJson),
		Headers: map[string]string{
			"Content-Type":                 "application/json",
			"Access-Control-Allow-Origin":  "*",
			"Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
			"Access-Control-Allow-Headers": "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization",
		},
	}, nil
}

func main() {
	lambda.Start(HandleRequest)
}