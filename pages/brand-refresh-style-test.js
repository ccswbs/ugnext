import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";

export default function StyledTest() {
  return (
    <Layout metadata={{ title: "Primary and Secondary Styles Test Page" }}>
      <Container centered>
        <Heading level={1}>Primary and Secondary Styles Test Page</Heading>
        <hr/>
        <div>
            <Heading level={2}>Use CSS variable styles</Heading>
            <div style={{ color: 'var(--primary-font)' }}>
               <h2 style={{ color: 'var(--primary-color-red)' }}>This is the primary style, font Bitter.</h2>
               <p style={{ color: 'var(--primary-color-red)' }}>
                <span style={{ color: 'var(--primary-color-red)',backgroundColor:'var(--primary-color-red)', marginRight:'1rem' }}>Span</span>
                This is red.
               </p>
               <p style={{ color: 'var(--primary-color-black)' }}>
                <span style={{ color: 'var(--primary-color-black)',backgroundColor:'var(--primary-color-black)', marginRight:'1rem' }}>Span</span>
                 This is black.
               </p>
               <p style={{ color: 'var(--primary-color-yellow)' }}>
                <span style={{ color: 'var(--primary-color-yellow)',backgroundColor:'var(--primary-color-yellow)', marginRight:'1rem' }}>Span</span>
                This is yellow.
                </p>
            </div>
            <div style={{ color: 'var(--secondary-font)' }}>
              <h2 style={{ color: 'var(--secondary-color-blue)' }}>This is the secondary style, font DM Sans.</h2>
              <p style={{ color: 'var(--secondary-color-blue)' }}>
                <span style={{ color: 'var(--secondary-color-blue)',backgroundColor:'var(--secondary-color-blue)', marginRight:'1rem' }}>Span</span>
                This is blue
              </p>
              <p style={{ color: 'var(--secondary-color-green)' }}>
                <span style={{ color: 'var(--secondary-color-green)',backgroundColor:'var(--secondary-color-green)', marginRight:'1rem' }}>Span</span>
               This is green
              </p>
              <p style={{ color: 'var(--secondary-color-light-gray)' }}>
                <span style={{ color: 'var(--secondary-color-light-gray)',backgroundColor:'var(--secondary-color-light-gray)', marginRight:'1rem' }}>Span</span>
                This is light gray.
              </p>
              <p style={{ color: 'var(--secondary-color-dark-gray)' }}>
                <span style={{ color: 'var(--secondary-color-dark-gray)',backgroundColor:'var(--secondary-color-dark-gray)', marginRight:'1rem' }}>Span</span>
                This is dark gray.
              </p>
            </div>
        </div>
        <hr/>
          <div>
            <Heading level={2}>Use Tailwind CSS styles</Heading>
            <div className="font-primary-bitter">
               <h2 className="text-primary-color">This is the primary style, font Bitter.</h2>               
               <p className="text-primary-color-red">
                <span className="text-primary-color bg-primary-color mr-2">Span</span>
                 This is red.
               </p>
               <p className="text-primary-color-black">
                <span className="text-primary-color-black bg-primary-color-black mr-2">Span</span>
                This is black.
               </p>
               <p className="text-primary-color-yellow">
                <span className="text-primary-color-yellow bg-primary-color-yellow mr-2">Span</span>
                This is yellow.
               </p>
            </div>
            <div className="font-secondary-dm-sans">
              <h2 className="text-secondary-color">This is the secondary style, font DM Sans.</h2>
              <p className="text-secondary-color-blue">
                <span className="text-secondary-color bg-secondary-color mr-2">Span</span>
                This is blue
              </p>
              <p className="text-secondary-color-green">
                <span className="text-secondary-color-green bg-secondary-color-green mr-2">Span</span>
                This is green
              </p>
              <p className="text-secondary-color-light-gray">
                <span className="text-secondary-color-light-gray bg-secondary-color-light-gray mr-2">Span</span>
                This is light gray.
              </p>
              <p className="text-secondary-color-dark-gray">
                <span className="text-secondary-color-dark-gray bg-secondary-color-dark-gray mr-2">Span</span>
                This is dark gray.
              </p>
            </div>
        </div>
      </Container>
    </Layout>
  );
}