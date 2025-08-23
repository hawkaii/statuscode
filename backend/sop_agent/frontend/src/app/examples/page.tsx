'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card } from '../../components/ui';

const SAMPLE_SOPS = [
  {
    id: 'cs-masters',
    title: 'Computer Science Master&apos;s Program',
    field: 'Computer Science',
    level: 'Master&apos;s',
    score: 92,
    preview: 'My passion for computer science began during my undergraduate studies when I first encountered machine learning algorithms...',
    content: `My passion for computer science began during my undergraduate studies when I first encountered machine learning algorithms. The elegant way these algorithms could learn patterns from data and make intelligent decisions fascinated me, leading me to pursue extensive research in this field.

During my bachelor's degree in Computer Engineering, I maintained a GPA of 3.8/4.0 and was consistently ranked in the top 5% of my class. My coursework in Data Structures, Algorithms, Database Systems, and Software Engineering provided me with a solid foundation in computer science fundamentals. However, it was my involvement in research projects that truly ignited my passion for advanced study.

In my junior year, I joined Professor Smith's research lab where I worked on developing neural network architectures for image recognition. This experience introduced me to the cutting-edge research happening in deep learning and computer vision. I contributed to a paper published in the International Conference on Machine Learning, which analyzed the effectiveness of different convolutional architectures for medical image analysis.

My industry experience as a software engineering intern at TechCorp further solidified my interest in applying machine learning to real-world problems. I worked on optimizing recommendation algorithms that served millions of users, gaining valuable insights into the challenges of deploying ML systems at scale. This experience taught me the importance of not just theoretical knowledge, but also practical implementation skills.

I am particularly drawn to your university's Master's program because of its strong focus on both theoretical foundations and practical applications. The research being conducted by Professor Johnson on federated learning aligns perfectly with my interests in privacy-preserving machine learning. I am excited about the opportunity to contribute to this research while expanding my knowledge in areas such as distributed systems and advanced algorithms.

My long-term goal is to pursue a career in AI research, either in academia or in industry research labs. I believe that the comprehensive curriculum and research opportunities at your university will provide me with the necessary skills and knowledge to achieve this goal. I am committed to making significant contributions to the field of computer science and look forward to the challenges and opportunities that graduate study will provide.`,
    strengths: ['Clear motivation', 'Specific research interests', 'Strong academic background', 'Relevant experience'],
    improvements: ['Could elaborate more on future research goals', 'Add more specific examples of achievements']
  },
  {
    id: 'mba-general',
    title: 'MBA General Management',
    field: 'Business Administration',
    level: 'Master&apos;s',
    score: 88,
    preview: 'Throughout my five-year career in consulting, I have consistently been drawn to the challenge of solving complex business problems...',
    content: `Throughout my five-year career in consulting, I have consistently been drawn to the challenge of solving complex business problems that require both analytical rigor and creative thinking. This passion for strategic problem-solving, combined with my desire to lead transformative initiatives, has led me to pursue an MBA at your esteemed institution.

My professional journey began at McKinsey & Company, where I worked as a Business Analyst for three years. During this time, I led teams in developing go-to-market strategies for Fortune 500 clients across various industries, including healthcare, technology, and consumer goods. One particularly impactful project involved helping a struggling retail chain restructure its operations, resulting in a 25% increase in profitability within 18 months.

Seeking to apply my consulting skills in an operational role, I transitioned to Amazon as a Senior Product Manager. In this capacity, I launched two new product lines that generated over $50M in revenue within their first year. This experience taught me the importance of customer-centric thinking and agile execution in driving business success. However, it also highlighted gaps in my knowledge, particularly in areas such as finance and organizational behavior, which an MBA program would help me address.

My leadership philosophy centers on empowering teams to achieve their full potential. As a consultant, I mentored junior analysts and was recognized with the "Outstanding Mentor" award. At Amazon, I led cross-functional teams of up to 15 people, fostering an environment of collaboration and innovation. These experiences have prepared me for the collaborative learning environment of business school.

I am particularly attracted to your MBA program because of its emphasis on experiential learning and global perspective. The International Business Immersion program would provide valuable exposure to emerging markets, which I believe will be crucial for future business leaders. Additionally, the program's strong network of alumni in consulting and technology aligns with my career aspirations.

Upon graduation, I plan to return to consulting, with the goal of eventually starting my own strategic advisory firm focused on helping mid-size companies navigate digital transformation. I believe that the comprehensive curriculum, diverse cohort, and extensive alumni network at your school will provide me with the skills, knowledge, and connections necessary to achieve this goal.

I am excited about the opportunity to contribute to the dynamic learning environment at your institution while preparing for the next phase of my career. The challenges and opportunities that an MBA provides align perfectly with my personal and professional aspirations.`,
    strengths: ['Strong work experience', 'Clear career progression', 'Leadership examples', 'Specific program knowledge'],
    improvements: ['Could be more specific about post-MBA timeline', 'Add more quantifiable achievements']
  },
  {
    id: 'phd-biology',
    title: 'PhD in Molecular Biology',
    field: 'Biology',
    level: 'PhD',
    score: 95,
    preview: 'The intricate dance of molecules within living cells has captivated my scientific curiosity since my first biology class...',
    content: `The intricate dance of molecules within living cells has captivated my scientific curiosity since my first biology class in high school. This fascination has only deepened through my academic journey, leading me to pursue a PhD in Molecular Biology to contribute to our understanding of fundamental biological processes.

My undergraduate research experience in Dr. Martinez's lab at State University was transformative. I spent two years investigating the role of microRNAs in cancer cell proliferation, a project that resulted in a first-author publication in Cell Biology International. This research experience taught me the importance of rigorous experimental design, careful data analysis, and clear scientific communication. More importantly, it reinforced my passion for uncovering the molecular mechanisms underlying human disease.

During my master's degree, I focused on epigenetic regulation of gene expression in stem cells. Working in Dr. Chen's laboratory, I developed expertise in advanced molecular techniques including CRISPR-Cas9 gene editing, single-cell RNA sequencing, and chromatin immunoprecipitation. My thesis research revealed novel histone modifications that regulate pluripotency, work that has been submitted for publication to Nature Cell Biology.

Beyond the laboratory, I have been committed to scientific outreach and education. I have volunteered as a tutor for undergraduate students, served as a teaching assistant for Molecular Biology courses, and participated in local science fairs as a judge. These experiences have strengthened my communication skills and deepened my appreciation for the importance of scientific literacy in society.

I am particularly excited about the opportunity to join Dr. Wilson's laboratory, whose groundbreaking work on protein-protein interactions in neurodegenerative diseases aligns perfectly with my research interests. The lab's innovative use of cryo-electron microscopy to study protein aggregation represents exactly the kind of cutting-edge research I want to be part of. I am also drawn to the collaborative environment at your university, where I would have the opportunity to interact with researchers from diverse backgrounds and disciplines.

My long-term career goal is to establish my own research laboratory focused on understanding the molecular basis of aging-related diseases. I believe that the comprehensive training in molecular biology, combined with the mentorship and resources available at your university, will provide me with the foundation necessary to become an independent researcher and contribute meaningfully to scientific knowledge.

I am prepared for the challenges and demands of PhD study and am committed to making significant contributions to the field of molecular biology. The opportunity to work with world-class faculty and access state-of-the-art facilities at your institution represents the perfect environment for me to achieve my research goals and develop as a scientist.`,
    strengths: ['Extensive research experience', 'Publications', 'Clear research focus', 'Specific lab interest', 'Future vision'],
    improvements: ['Already very strong', 'Minor: could add more about broader impact of research']
  }
];

export default function ExamplesPage() {
  const [selectedSOP, setSelectedSOP] = useState<typeof SAMPLE_SOPS[0] | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              ✨ Sample SOPs & Examples
            </h1>
            <Link
              href="/"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
          <p className="text-lg text-gray-600">
            Explore high-quality SOP examples across different fields and degree levels to inspire your own writing.
          </p>
        </div>

        {!selectedSOP ? (
          // SOP Grid
          <div className="space-y-6">
            {/* Tips Section */}
            <Card className="bg-blue-50 border-blue-200">
              <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                💡 How to Use These Examples
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <h3 className="font-medium mb-2">✅ Do:</h3>
                  <ul className="space-y-1">
                    <li>• Use as inspiration for structure and tone</li>
                    <li>• Note how they connect experiences to goals</li>
                    <li>• Observe specific examples and achievements</li>
                    <li>• Learn from their storytelling approach</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">❌ Don&apos;t:</h3>
                  <ul className="space-y-1">
                    <li>• Copy content directly</li>
                    <li>• Use the same examples or experiences</li>
                    <li>• Replicate without personalizing</li>
                    <li>• Ignore your unique background</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* SOP Examples Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {SAMPLE_SOPS.map((sop) => (
                <Card key={sop.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedSOP(sop)}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">{sop.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{sop.field}</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{sop.level}</span>
                        </div>
                      </div>
                      <div className={`text-2xl font-bold ${
                        sop.score >= 90 ? 'text-green-600' : 
                        sop.score >= 80 ? 'text-blue-600' : 'text-yellow-600'
                      }`}>
                        {sop.score}/100
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {sop.preview}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-green-700 mb-1">✅ Key Strengths:</h4>
                        <div className="flex flex-wrap gap-1">
                          {sop.strengths.slice(0, 3).map((strength, index) => (
                            <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedSOP(sop)}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        📖 Read Full Example
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Additional Resources */}
            <Card className="bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                📚 Additional Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">📝</div>
                  <h3 className="font-medium text-gray-800 mb-1">Writing Tips</h3>
                  <p className="text-sm text-gray-600">Learn the fundamentals of effective SOP writing</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="font-medium text-gray-800 mb-1">Program Research</h3>
                  <p className="text-sm text-gray-600">How to research and tailor to specific programs</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">✨</div>
                  <h3 className="font-medium text-gray-800 mb-1">Common Mistakes</h3>
                  <p className="text-sm text-gray-600">Avoid the most frequent SOP writing pitfalls</p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          // Selected SOP View
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={() => setSelectedSOP(null)}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              ← Back to Examples
            </button>

            {/* SOP Header */}
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{selectedSOP.title}</h1>
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">{selectedSOP.field}</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded">{selectedSOP.level}</span>
                    <span className={`text-lg font-bold ${
                      selectedSOP.score >= 90 ? 'text-green-600' : 
                      selectedSOP.score >= 80 ? 'text-blue-600' : 'text-yellow-600'
                    }`}>
                      Score: {selectedSOP.score}/100
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedSOP.content);
                      alert('SOP content copied to clipboard!');
                    }}
                    className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  >
                    📋 Copy
                  </button>
                  <Link
                    href="/review"
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    📝 Try Our Reviewer
                  </Link>
                </div>
              </div>
            </Card>

            {/* SOP Content */}
            <Card>
              <div className="prose max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {selectedSOP.content}
                </div>
              </div>
            </Card>

            {/* Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-green-50 border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                  ✅ Key Strengths
                </h3>
                <ul className="space-y-2">
                  {selectedSOP.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-green-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="bg-amber-50 border-amber-200">
                <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  💡 Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {selectedSOP.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2 text-amber-700">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}