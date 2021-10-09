package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"net/http"
	"net/url"
	"strings"
)

type Request events.APIGatewayProxyRequest
type Response events.APIGatewayProxyResponse

type DomainRequest struct {
	Domain string `json:"domain"`
}

type CertsResponse struct {
	Certs     []Certificate `json:"certs"`
	CertChain string        `json:"cert_chain"`
}

func HandleRequest(_ context.Context, req Request) (Response, error) {
	if !check(req) {
		return Response{StatusCode: 400}, nil
	}
	var domReq DomainRequest
	// parse request
	err := json.Unmarshal([]byte(req.Body), &domReq)
	if err != nil {
		return Response{StatusCode: 400, Body: fmt.Sprintf("Request %+v cannot be parsed because of: %s", req, err.Error())}, nil
	}
	// parse URL
	u, err := url.Parse(domReq.Domain)
	if err != nil {
		return Response{StatusCode: 400, Body: fmt.Sprintf("The requested URL is not a valid URL: %s", domReq.Domain)}, nil
	}
	// check URL begins with https://
	if u.Scheme != "https" {
		return Response{StatusCode: 400, Body: "The requested URL must begin with https://"}, nil
	}
	client := &http.Client{}
	domainResp, err := client.Get(domReq.Domain)
	if err != nil {
		return Response{StatusCode: 404, Body: err.Error()}, nil
	}
	resp := CertsResponse{Certs: []Certificate{}}
	if domainResp.TLS == nil {
		return Response{StatusCode: 400, Body: "The website did not present a TLS connection."}, nil
	}
	var sb strings.Builder
	for _, cert := range domainResp.TLS.VerifiedChains[0] {
		c := ParseCertificate(cert)
		resp.Certs = append(resp.Certs, *c)
		sb.WriteString(c.CryptoInfo.RawPEM)
	}
	resp.CertChain = sb.String()
	certsJson, _ := json.Marshal(resp)
	return Response{
		StatusCode: 200,
		Body:       string(certsJson),
		Headers:    map[string]string{"Content-Type": "application/json"},
	}, nil
}

func main() {
	lambda.Start(HandleRequest)
}
