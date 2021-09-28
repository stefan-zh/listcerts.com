## listcerts.com

The idea for this website came from the fact that there isn't a good place online (or I couldn't easily find one), 
where one can see the SSL certificates used by a website in an HTTPS connection.

Chrome, Firefox, and Edge all provide ways for everyone to view the SSL certificates in the browser, but each of them 
displays the certificates differently. I believe that for most people certificate information is difficult to read, 
and when that is paired with a complex presentation, it becomes nearly impossible to comprehend it. Which is why 
it's important to have a clean design. In my opinion, Firefox does this best in their browser, and this project is 
largely inspired by that.

## How to start this project locally

The front end of this project is built with [create-react-app](https://create-react-app.dev). If you have Node installed
locally, you can run this app by typing `npm start` in the terminal. You can access [http://localhost:3000](http://localhost:3000) 
to view it in the browser.

The page will reload if you make edits, and you will also see any lint errors in the console.

## Technologies

### Front end

- I used [Create React App](https://create-react-app.dev) for bootstrapping a [React](https://reactjs.org/) front end. 
The code is strongly typed with Typescript.
- The UI is built with [React Bootstrap](https://react-bootstrap.github.io/) components.

### Back end

- The back end is written in [Go](https://golang.org/). It is executed by an AWS Lambda function.

### Hosting

- The front end is hosted on [AWS S3](https://aws.amazon.com/s3/) as static content.
- The back end consists of an API endpoint provided by [AWS API Gateway](https://aws.amazon.com/api-gateway/), which is
linked to an [AWS Lambda](https://aws.amazon.com/lambda/) function, and executes it on each request.
- The domains and the DNS records are managed by [AWS Route53](https://aws.amazon.com/route53/).
- The SSL certificates for HTTPS are provided by [AWS Certificate Manager](https://aws.amazon.com/certificate-manager/).
- An [AWS CloudFront](https://aws.amazon.com/cloudfront/) distribution is the link between the Route53 DNS records,
the SSL certificate, and the S3 bucket.

### Resources

If you'd like to learn how to host a static website yourself on AWS S3 with all of the tooling above, I highly
recommend this blog post, which helped me a lot in the hosting process: https://towardsdatascience.com/static-hosting-with-ssl-on-s3-a4b66fb7cd00
