import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";

export default function StyledTest() {
  return (
    <Layout metadata={{ title: "uog and uog Styles Test Page" }}>
      <Container centered>
        <Heading level={1}>uog and uog Styles Test Page</Heading>
        <hr/>
        <div>
            <Heading level={1}>This is H1</Heading>
            <Heading level={2}  className="text-red">This is H2</Heading>
            <Heading level={3}>This is H3</Heading>
            <Heading level={4}>This is H4</Heading>
            <Heading level={5}>This is H5</Heading>
            <Heading level={6}>This is H6</Heading>
            <p>This is p tag: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        <hr/>
        
        <div>
            <Heading level={2}>Use CSS variable styles</Heading>
            <div style={{ color: 'var(--bitter-font)' }}>
               <h2 style={{ color: 'var(--red)' }}>This is the uog style, font Bitter.</h2>
               <p style={{ color: 'var(--red)' }}>
                <span style={{ color: 'var(--red)',backgroundColor:'var(--red)', marginRight:'1rem' }}>Span</span>
                This is red.
               </p>
               <p style={{ color: 'var(--black)' }}>
                <span style={{ color: 'var(--black)',backgroundColor:'var(--black)', marginRight:'1rem' }}>Span</span>
                 This is black.
               </p>
               <p style={{ color: 'var(--yellow)' }}>
                <span style={{ color: 'var(--yellow)',backgroundColor:'var(--yellow)', marginRight:'1rem' }}>Span</span>
                This is yellow.
                </p>
            </div>
            <div style={{ color: 'var(--dmSans-font)' }}>
              <h2 style={{ color: 'var(--blue)' }}>This is the uog style, font DM Sans.</h2>
              <p style={{ color: 'var(--blue)' }}>
                <span style={{ color: 'var(--blue)',backgroundColor:'var(--blue)', marginRight:'1rem' }}>Span</span>
                This is blue
              </p>
              <p style={{ color: 'var(--green)' }}>
                <span style={{ color: 'var(--green)',backgroundColor:'var(--green)', marginRight:'1rem' }}>Span</span>
               This is green
              </p>
              <p style={{ color: 'var(--light-gray)' }}>
                <span style={{ color: 'var(--light-gray)',backgroundColor:'var(--light-gray)', marginRight:'1rem' }}>Span</span>
                This is light gray.
              </p>
              <p style={{ color: 'var(--dark-gray)' }}>
                <span style={{ color: 'var(--dark-gray)',backgroundColor:'var(--dark-gray)', marginRight:'1rem' }}>Span</span>
                This is dark gray.
              </p>
            </div>
        </div>
        <hr/>
          <div>
            <Heading level={2}>Use Tailwind CSS styles</Heading>
            <div className="font-bitter">
               <h2 className="text-red">This is the uog style, font Bitter.</h2>               
               <p className="text-red">
                <span className="text bg-red hover:bg-red-hover mr-2">Span</span>
                 This is red.
               </p>
               <p className="text-black">
                <span className="text-black bg-black mr-2">Span</span>
                This is black.
               </p>
               <p className="text-yellow">
                <span className="text-yellow bg-yellow mr-2">Span</span>
                This is yellow.
               </p>
            </div>
            <div className="font-dm-sans">
              <h2 className="text">This is the uog style, font DM Sans.</h2>
              <p className="text-blue">
                <span className="text bg-blue mr-2">Span</span>
                This is blue
              </p>
              <p className="text-green">
                <span className="text-green bg-green mr-2">Span</span>
                This is green
              </p>
              <p className="text-light-gray">
                <span className="text-light-gray bg-gray-light mr-2">Span</span>
                This is light gray.
              </p>
              <p className="text-dark-gray">
                <span className="text-dark-gray bg-gray mr-2">Span</span>
                This is dark gray.
              </p>
            </div>
        </div>
      </Container>
    </Layout>
  );
}