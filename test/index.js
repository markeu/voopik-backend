import chai from 'chai';
import chaiHttp from 'chai-http';
let { expect } = chai;
import app from '../app';

chai.use(chaiHttp);

describe('GET /suggestions', () => {
  describe('with a non-existent city', (done) => {
    let response;
    before((done) => {
      chai.request(app)
        .get('/suggestions?q=zoooooon')
        .end((err, res) => {
          response = res;
          done();
        });
    });

    it('returns a 200', (done) => {
      expect(response.status).to.equal(200);
      done()
    });

    it('returns an empty array of suggestions', (done) => {
      expect(response.body.suggestions).to.be.instanceof(Array);
      expect(response.body.suggestions).to.have.length(0);
      done()
    });
  });

  describe('with a valid city',(done) => {
    let response;

    before( (done) => {
      chai.request(app)
        .get('/suggestions?q=Montreal')
        .end((err, res) => {
          response = res;
          done(err);
        });
    });

    it('returns a 200',(done) => {
      expect(response.statusCode).to.equal(200);
      done()
    });

    it('returns an array of suggestions',(done) => {
      expect(response.body.suggestions).to.be.instanceof(Array);
      expect(response.body.suggestions).to.have.length.above(0);
      done()
    });

    it('contains a match', () => {
      expect(response.body.suggestions).to.satisfy((suggestions) => {
        return suggestions.some((suggestion) => {
          return suggestion.name.match(/montr/i);
        });
      })
    });

    it('contains latitudes and longitudes',() => {
      expect(response.body.suggestions).to.satisfy( (suggestions) => {
        return suggestions.every((suggestion) => {
          return suggestion.latitude && suggestion.longitude;
        });
      })
    });

    it('contains scores',() => {
      expect(response.body.suggestions).to.satisfy((suggestions) => {
        return suggestions.every((suggestion) => {
          return suggestion.latitude && suggestion.longitude;
        });
      })
    });
  });
});

