# services/report_generator.py
import matplotlib.pyplot as plt
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet
import re

def generate_graphs(df):
    graphs = []
    
    # Example: Histogram for numerical columns
    for column in df.select_dtypes(include=['float64', 'int64']).columns:
        plt.figure()
        df[column].plot(kind='hist', title=f'Distribution of {column}')
        plt.xlabel(column)
        plt.ylabel('Frequency')
        graph_path = f"{column}_histogram.png"
        plt.savefig(graph_path)
        plt.close()
        graphs.append(graph_path)
    
    return graphs

def clean_and_format_text(text):
    # Remove unwanted symbols like *, #, etc.
    text = re.sub(r"[*#\-]", "", text)
    
    # Split the text into sections
    sections = re.split(r"\n\s*\n", text)
    
    # Format each section
    formatted_text = []
    for section in sections:
        if not section.strip():
            continue
        
        # Split into title and content
        if ":" in section:
            title, content = section.split(":", 1)
            title = title.strip()
            content = content.strip()
        else:
            title = ""
            content = section.strip()
        
        # Add section title (if any)
        if title:
            formatted_text.append(f"{title}:")
        
        # Add content as paragraphs or bullet points
        if content:
            formatted_text.append(content)
    
    return "\n\n".join(formatted_text)

def create_pdf_report(analysis_text, graphs, output_path):
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Add title
    story.append(Paragraph("Anomaly Detection Report", styles['Title']))
    story.append(Spacer(1, 12))
    
    # Clean and format the analysis text
    cleaned_text = clean_and_format_text(analysis_text)
    
    # Add formatted analysis text
    for paragraph in cleaned_text.split("\n\n"):
        story.append(Paragraph(paragraph, styles['BodyText']))
        story.append(Spacer(1, 12))
    
    # Add graphs to the PDF
    for graph in graphs:
        story.append(Paragraph(f"Graph: {graph}", styles['Heading2']))
        story.append(Spacer(1, 12))
        story.append(Image(graph, width=400, height=300))
        story.append(Spacer(1, 12))
    
    # Build the PDF
    doc.build(story)