import React, { useState, useEffect } from 'react';
import { organizations } from '../organizations';

const ThanksSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={sectionStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>🏢 Organizations We Support</h2>
        <p style={subtitleStyle}>
          We're proud to collaborate with these innovative organizations working on climate action, sustainability, and community engagement in the Seattle region.
        </p>
      </div>
      
      <div style={{
        ...organizationsGridStyle,
        ...(isMobile ? mobileOrganizationsGridStyle : {})
      }}>
        {organizations.map((org) => (
          <div key={org.id} style={{
            ...orgItemStyle,
            ...(isMobile ? mobileOrgItemStyle : {}),
            ...(isMobile ? {} : desktopOrgItemStyle) // Apply desktop hover effect only on desktop
          }}>
            <div style={{
              ...imageContainerStyle,
              ...(isMobile ? mobileImageContainerStyle : {})
            }}>
              <img 
                src={org.image} 
                alt={`${org.name} logo`}
                style={{
                  ...orgImageStyle,
                  ...(isMobile ? mobileOrgImageStyle : {})
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={{
                ...fallbackStyle,
                ...(isMobile ? mobileFallbackStyle : {})
              }}>
                <span style={{
                  ...fallbackTextStyle,
                  ...(isMobile ? mobileFallbackTextStyle : {})
                }}>{org.name.charAt(0)}</span>
              </div>
            </div>
            
            <div style={{
              ...orgContentStyle,
              ...(isMobile ? mobileOrgContentStyle : {})
            }}>
              <h3 style={{
                ...orgNameStyle,
                ...(isMobile ? mobileOrgNameStyle : {})
              }}>{org.name}</h3>
              <p style={{
                ...orgCategoryStyle,
                ...(isMobile ? mobileOrgCategoryStyle : {})
              }}>{org.category}</p>
              <p style={{
                ...orgDescriptionStyle,
                ...(isMobile ? mobileOrgDescriptionStyle : {})
              }}>{org.description}</p>
              <a 
                href={org.link} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  ...orgLinkStyle,
                  ...(isMobile ? mobileOrgLinkStyle : {})
                }}
              >
                Learn More →
              </a>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{
        ...footerStyle,
        ...(isMobile ? mobileFooterStyle : {})
      }}>
        <p style={{
          ...footerTextStyle,
          ...(isMobile ? mobileFooterTextStyle : {})
        }}>
          These organizations represent the diverse ecosystem of climate action and sustainability work happening in our community. 
          We're committed to supporting their missions and amplifying their impact.
        </p>
        <a 
          href="https://docs.google.com/document/d/17pS34USuxbbgimk2P6vQ3uiEpEIOhwAZrLjk6esymrs/edit?tab=t.0#heading=h.tyfszs294hul" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            ...learnMoreLinkStyle,
            ...(isMobile ? mobileLearnMoreLinkStyle : {})
          }}
        >
          Learn More About Us →
        </a>
      </div>
    </div>
  );
};

// Inline styles
const sectionStyle = {
  padding: '2rem 1rem',
  maxWidth: '1200px',
  margin: '0 auto',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '3rem',
  padding: '0 1rem'
};

const titleStyle = {
  fontSize: 'clamp(2rem, 5vw, 2.5rem)',
  fontWeight: '700',
  color: '#1a202c',
  marginBottom: '1rem'
};

const subtitleStyle = {
  fontSize: 'clamp(1rem, 3vw, 1.2rem)',
  color: '#4a5568',
  maxWidth: '700px',
  margin: '0 auto',
  lineHeight: '1.6',
  marginBottom: '2rem'
};



const organizationsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '2rem',
  marginBottom: '3rem',
  padding: '0 1rem'
};

const orgItemStyle = {
  background: 'white',
  borderRadius: '16px',
  padding: '1.5rem',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid #e2e8f0',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  minHeight: '300px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

// Add hover effects for desktop
const desktopOrgItemStyle = {
  ':hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
  }
};

const imageContainerStyle = {
  position: 'relative',
  marginBottom: '1rem',
  textAlign: 'center'
};

const orgImageStyle = {
  width: '100%',
  maxWidth: '200px',
  height: 'auto',
  borderRadius: '8px',
  objectFit: 'contain'
};

const fallbackStyle = {
  display: 'none',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto'
};

const fallbackTextStyle = {
  color: 'white',
  fontSize: '2rem',
  fontWeight: 'bold'
};

const orgContentStyle = {
  textAlign: 'center'
};

const orgNameStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#1a202c',
  marginBottom: '0.5rem'
};

const orgCategoryStyle = {
  fontSize: '0.9rem',
  color: '#0071e3',
  fontWeight: '500',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '1rem'
};

const orgDescriptionStyle = {
  fontSize: '1rem',
  color: '#4a5568',
  lineHeight: '1.6',
  marginBottom: '1.5rem'
};

const orgLinkStyle = {
  display: 'inline-block',
  color: '#0071e3',
  textDecoration: 'none',
  fontWeight: '500',
  fontSize: '0.9rem',
  padding: '0.5rem 1rem',
  border: '2px solid #0071e3',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
  ':hover': {
    background: '#0071e3',
    color: 'white'
  }
};

const footerStyle = {
  textAlign: 'center',
  padding: '2rem',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  borderRadius: '16px',
  border: '1px solid #e2e8f0'
};

const footerTextStyle = {
  fontSize: '1.1rem',
  color: '#4a5568',
  marginBottom: '1.5rem',
  lineHeight: '1.6'
};

const learnMoreLinkStyle = {
  display: 'inline-block',
  color: '#0071e3',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '1rem',
  padding: '0.75rem 1.5rem',
  border: '2px solid #0071e3',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  ':hover': {
    background: '#0071e3',
    color: 'white',
    transform: 'translateY(-2px)'
  }
};

// Mobile specific styles
const mobileOrganizationsGridStyle = {
  gridTemplateColumns: '1fr',
  gap: '1.5rem',
  padding: '0 1rem'
};

const mobileOrgItemStyle = {
  padding: '1rem',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  margin: '0 0.5rem',
  minHeight: 'auto',
  borderRadius: '12px'
};

const mobileImageContainerStyle = {
  marginBottom: '0.5rem',
  textAlign: 'center'
};

const mobileOrgImageStyle = {
  maxWidth: '120px',
  height: 'auto'
};

const mobileFallbackStyle = {
  width: '60px',
  height: '60px',
  borderRadius: '30px',
  fontSize: '1.5rem'
};

const mobileFallbackTextStyle = {
  fontSize: '1.2rem'
};

const mobileOrgContentStyle = {
  textAlign: 'left',
  flex: '1'
};

const mobileOrgNameStyle = {
  fontSize: '1.2rem',
  marginBottom: '0.5rem'
};

const mobileOrgCategoryStyle = {
  fontSize: '0.8rem',
  marginBottom: '0.5rem'
};

const mobileOrgDescriptionStyle = {
  fontSize: '0.9rem',
  marginBottom: '1rem',
  lineHeight: '1.5'
};

const mobileOrgLinkStyle = {
  fontSize: '0.8rem',
  padding: '0.4rem 0.8rem',
  alignSelf: 'flex-start'
};

const mobileFooterStyle = {
  padding: '1.5rem',
  borderRadius: '12px',
  margin: '0 1rem'
};

const mobileFooterTextStyle = {
  fontSize: '1rem',
  marginBottom: '1rem',
  lineHeight: '1.5'
};

const mobileLearnMoreLinkStyle = {
  fontSize: '0.9rem',
  padding: '0.6rem 1.2rem'
};

export default ThanksSection; 