import { PrismaClient, UserRole, CaseStatus, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@chakshi.com' },
    update: {
      name: 'Admin User',
      role: UserRole.ADVOCATE, // Assuming ADMIN is not a direct role, using ADVOCATE for now
      phone: '+91-9876543210',
      bio: 'System Administrator',
    },
    create: {
      email: 'admin@chakshi.com',
      name: 'Admin User',
      role: UserRole.ADVOCATE, // Assuming ADMIN is not a direct role, using ADVOCATE for now
      phone: '+91-9876543210',
      bio: 'System Administrator',
      advocateProfile: { // Use advocateProfile for relations
        create: {
          firmName: 'Chakshi Admin',
          metaJson: {
            department: 'IT',
            permissions: ['all']
          }
        }
      }
    },
    include: { advocateProfile: true }
  });

  // Create Advocate User
  const advocateUser = await prisma.user.upsert({
    where: { email: 'advocate@chakshi.com' },
    update: {
      name: 'John Advocate',
      role: UserRole.ADVOCATE,
      phone: '+91-9876543211',
      bio: 'Senior Legal Advocate with 10+ years experience',
    },
    create: {
      email: 'advocate@chakshi.com',
      name: 'John Advocate',
      role: UserRole.ADVOCATE,
      phone: '+91-9876543211',
      bio: 'Senior Legal Advocate with 10+ years experience',
      advocateProfile: { // Use advocateProfile for relations
        create: {
          firmName: 'Advocate & Co.',
          barId: 'BAR123456',
          metaJson: {
            specialization: ['Criminal Law', 'Civil Law'],
            experience: '10 years',
            verified: true
          }
        }
      }
    },
    include: { advocateProfile: true }
  });

  // Create Student User
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@chakshi.com' },
    update: {
      name: 'Jane Student',
      role: UserRole.STUDENT,
      phone: '+91-9876543212',
      bio: 'Law student interested in learning',
    },
    create: {
      email: 'student@chakshi.com',
      name: 'Jane Student',
      role: UserRole.STUDENT,
      phone: '+91-9876543212',
      bio: 'Law student interested in learning',
      // Students don't have advocateProfile
    },
  });

  // Create Client User (as a User first)
  const clientUserAccount = await prisma.user.upsert({
    where: { email: 'client@chakshi.com' },
    update: {
      name: 'Bob Client',
      role: UserRole.STUDENT, // Assuming CLIENT is not a direct role, using STUDENT for now
      phone: '+91-9876543213',
      bio: 'Individual seeking legal assistance',
    },
    create: {
      email: 'client@chakshi.com',
      name: 'Bob Client',
      role: UserRole.STUDENT, // Assuming CLIENT is not a direct role, using STUDENT for now
      phone: '+91-9876543213',
      bio: 'Individual seeking legal assistance',
      // Clients don't have advocateProfile
    },
  });

  // Create a Client record linked to the clientUserAccount
  const clientRecord = await prisma.client.upsert({
    where: { email: 'client@chakshi.com' },
    update: {
      name: clientUserAccount.name,
      phone: clientUserAccount.phone,
      createdBy: clientUserAccount.id,
    },
    create: {
      name: clientUserAccount.name,
      email: clientUserAccount.email,
      phone: clientUserAccount.phone,
      createdBy: clientUserAccount.id,
    },
  });

  // Create sample cases
  const existingCase1 = await prisma.case.findUnique({ where: { title: 'Property Dispute Resolution' } as any });
  const sampleCase1 = existingCase1
    ? await prisma.case.update({
        where: { title: 'Property Dispute Resolution' } as any,
        data: {
          category: 'Property Law',
          status: CaseStatus.ACTIVE,
          advocateId: advocateUser.id,
          clientId: clientRecord.id, // Use the actual Client record's ID
          openedDate: new Date('2023-01-15'),
        },
      })
    : await prisma.case.create({
        data: {
          title: 'Property Dispute Resolution',
          category: 'Property Law',
          status: CaseStatus.ACTIVE,
          advocateId: advocateUser.id,
          clientId: clientRecord.id, // Use the actual Client record's ID
          openedDate: new Date('2023-01-15'),
        },
      });

  const existingCase2 = await prisma.case.findUnique({ where: { title: 'Contract Review' } as any });
  const sampleCase2 = existingCase2
    ? await prisma.case.update({
        where: { title: 'Contract Review' } as any,
        data: {
          category: 'Contract Law',
          status: CaseStatus.PENDING,
          advocateId: advocateUser.id,
          clientId: clientRecord.id, // Use the actual Client record's ID
          openedDate: new Date('2023-03-01'),
        },
      })
    : await prisma.case.create({
        data: {
          title: 'Contract Review',
          category: 'Contract Law',
          status: CaseStatus.PENDING,
          advocateId: advocateUser.id,
          clientId: clientRecord.id, // Use the actual Client record's ID
          openedDate: new Date('2023-03-01'),
        },
      });

  // Create sample categories
  const categoriesData = [
    { name: 'Government', slug: 'government', description: 'Templates related to government applications and procedures.' },
    { name: 'Criminal', slug: 'criminal', description: 'Templates for criminal law matters.' },
    { name: 'Consumer', slug: 'consumer', description: 'Templates for consumer rights and complaints.' },
    { name: 'Property', slug: 'property', description: 'Templates for property law and real estate.' },
    { name: 'Personal', slug: 'personal', description: 'Templates for personal legal matters like wills and notices.' },
    { name: 'Civil', slug: 'civil', description: 'Templates for civil law cases.' },
    { name: 'Corporate', slug: 'corporate', description: 'Templates for corporate and business legal needs.' },
    { name: 'Information Rights', slug: 'information-rights', description: 'Templates related to information access and rights.' },
    { name: 'Crime Reporting', slug: 'crime-reporting', description: 'Templates for reporting crimes and police complaints.' },
    { name: 'Consumer Rights', slug: 'consumer-rights', description: 'Templates for consumer protection and court assistance.' },
    { name: 'Property Law', slug: 'property-law', description: 'Templates specific to property agreements and verification.' },
    { name: 'Estate Planning', slug: 'estate-planning', description: 'Templates for wills, trusts, and estate management.' },
    { name: 'Legal Notices', slug: 'legal-notices', description: 'Templates for drafting various legal notices.' },
    { name: 'Police Records', slug: 'police-records', description: 'Templates for accessing police records like FIR copies.' },
    { name: 'Property Verification', slug: 'property-verification', description: 'Templates for comprehensive property due diligence.' },
    { name: 'Employment Law', slug: 'employment-law', description: 'Templates for employment contracts and related legal documents.' },
    { name: 'Business Formation', slug: 'business-formation', description: 'Templates for starting and legally structuring a business.' },
  ];

  const categories: { [key: string]: any } = {};
  for (const catData of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: {},
      create: catData,
    });
    categories[catData.name] = category;
  }

  // Create sample templates
  const templatesData = [
    {
      title: 'RTI Application Generator',
      description: 'Create comprehensive Right to Information applications with automated legal formatting and government compliance checks.',
      content: 'Content for RTI Application Generator...',
      categoryId: categories['Information Rights'].id,
      tags: ['government', 'information-rights'],
      isPublic: true,
      isFree: true,
      difficulty: 'Beginner',
      rating: 4.9,
      ratingCount: 120,
      completionTimeMin: 10,
      successRatePct: 98.00,
      createdBy: advocateUser.id,
    },
    {
      title: 'Police Complaint Builder',
      description: 'Generate legally sound police complaints with proper formatting, evidence attachment guidelines, and follow-up procedures.',
      content: 'Content for Police Complaint Builder...',
      categoryId: categories['Crime Reporting'].id,
      tags: ['criminal', 'crime-reporting'],
      isPublic: true,
      isFree: true,
      difficulty: 'Intermediate',
      rating: 4.7,
      ratingCount: 95,
      completionTimeMin: 15,
      successRatePct: 94.00,
      createdBy: advocateUser.id,
    },
    {
      title: 'Consumer Court Assistant',
      description: 'Draft comprehensive consumer complaints with automated damage calculations, legal precedent references, and court filing guidance.',
      content: 'Content for Consumer Court Assistant...',
      categoryId: categories['Consumer Rights'].id,
      tags: ['consumer', 'consumer-rights'],
      isPublic: true,
      isFree: true,
      difficulty: 'Intermediate',
      rating: 4.8,
      ratingCount: 110,
      completionTimeMin: 20,
      successRatePct: 96.00,
      createdBy: advocateUser.id,
    },
    {
      title: 'Smart Rental Agreement',
      description: 'Create legally compliant rental agreements with city-specific clauses, automatic rent calculations, and tenant protection features.',
      content: 'Content for Smart Rental Agreement...',
      categoryId: categories['Property Law'].id,
      tags: ['property', 'rental', 'agreement'],
      isPublic: true,
      isFree: true,
      difficulty: 'Advanced',
      rating: 4.9,
      ratingCount: 150,
      completionTimeMin: 25,
      successRatePct: 99.00,
      createdBy: advocateUser.id,
    },
    {
      title: 'Will & Testament Creator',
      description: 'Design comprehensive wills with asset distribution planning, executor guidelines, and legal validity verification across states.',
      content: 'Content for Will & Testament Creator...',
      categoryId: categories['Estate Planning'].id,
      tags: ['personal', 'estate-planning', 'premium'],
      isPublic: true,
      isFree: false,
      difficulty: 'Advanced',
      rating: 4.6,
      ratingCount: 80,
      completionTimeMin: 30,
      successRatePct: 97.00,
      createdBy: advocateUser.id,
    },
    {
      title: 'Legal Notice Generator',
      description: 'Draft formal legal notices with appropriate legal language, response timelines, and escalation procedures for various situations.',
      content: 'Content for Legal Notice Generator...',
      categoryId: categories['Legal Notices'].id,
      tags: ['personal', 'legal-notices'],
      isPublic: true,
      isFree: true,
      difficulty: 'Intermediate',
      rating: 4.7,
      ratingCount: 100,
      completionTimeMin: 15,
      successRatePct: 95.00,
      createdBy: advocateUser.id,
    },
    {
      title: 'FIR Copy Application',
      description: 'Generate applications for certified FIR copies with proper documentation requirements and police station procedures.',
      content: 'Content for FIR Copy Application...',
      categoryId: categories['Police Records'].id,
      tags: ['criminal', 'police-records'],
      isPublic: true,
      isFree: true,
      difficulty: 'Beginner',
      rating: 4.8,
      ratingCount: 70,
      completionTimeMin: 8,
      successRatePct: 99.00,
      createdBy: advocateUser.id,
    },
    {
      title: 'Property Due Diligence Kit',
      description: 'Comprehensive property verification toolkit with document checklists, legal compliance checks, and investment risk assessment.',
      content: 'Content for Property Due Diligence Kit...',
      categoryId: categories['Property Verification'].id,
      tags: ['property', 'verification', 'premium'],
      isPublic: true,
      isFree: false,
      difficulty: 'Advanced',
      rating: 4.8,
      ratingCount: 60,
      completionTimeMin: 35,
      successRatePct: 93.00,
      createdBy: advocateUser.id,
    },
    {
      title: 'Employment Contract Builder',
      description: 'Create comprehensive employment contracts with role-specific clauses, compliance checks, and industry standard terms.',
      content: 'Content for Employment Contract Builder...',
      categoryId: categories['Employment Law'].id,
      tags: ['corporate', 'employment-law'],
      isPublic: true,
      isFree: true,
      difficulty: 'Intermediate',
      rating: 4.7,
      ratingCount: 90,
      completionTimeMin: 20,
      successRatePct: 96.00,
      createdBy: advocateUser.id,
    },
    {
      title: 'Startup Legal Essentials',
      description: 'Complete legal documentation package for startups including incorporation papers, founder agreements, and compliance guides.',
      content: 'Content for Startup Legal Essentials...',
      categoryId: categories['Business Formation'].id,
      tags: ['corporate', 'business-formation', 'premium'],
      isPublic: true,
      isFree: false,
      difficulty: 'Advanced',
      rating: 4.9,
      ratingCount: 75,
      completionTimeMin: 50,
      successRatePct: 94.00,
      createdBy: advocateUser.id,
    },
  ];

  for (const templateData of templatesData) {
    const existingTemplate = await prisma.template.findUnique({ where: { title: templateData.title } as any });
    if (existingTemplate) {
      await prisma.template.update({
        where: { title: templateData.title } as any,
        data: templateData,
      });
    } else {
      await prisma.template.create({
        data: templateData,
      });
    }
  }

  // Create sample courses
  const courses = [
    {
      title: 'Introduction to Indian Legal System',
      description: 'Comprehensive overview of the Indian legal framework',
      content: 'This course covers the fundamentals of Indian law...',
      duration: 480, // 8 hours
      price: 2999.00,
      isActive: true
    },
    {
      title: 'Contract Law Essentials',
      description: 'Understanding the basics of contract law',
      content: 'Learn about contract formation, enforcement, and remedies...',
      duration: 360, // 6 hours
      price: 1999.00,
      isActive: true
    },
    {
      title: 'Criminal Law Procedures',
      description: 'Criminal law procedures and practices in India',
      content: 'Detailed study of criminal procedures...',
      duration: 600, // 10 hours
      price: 3999.00,
      isActive: true
    }
  ];

  for (const course of courses) {
    const existingCourse = await prisma.course.findUnique({ where: { title: course.title } as any });
    if (existingCourse) {
      await prisma.course.update({
        where: { title: course.title } as any,
        data: course,
      });
    } else {
      await prisma.course.create({
        data: course,
      });
    }
  }

  // Create sample enrollment
  const introLawCourse = await prisma.course.findFirst({
    where: { title: 'Introduction to Indian Legal System' }
  });

  if (introLawCourse) {
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: studentUser.id,
          courseId: introLawCourse.id
        }
      },
      update: {},
      create: {
        userId: studentUser.id,
        courseId: introLawCourse.id,
        progress: 25,
        completed: false
      }
    });
  }

  // Create sample notifications
  const notificationsData = [
    {
      user: { connect: { id: clientUserAccount.id } },
      type: 'Case Update',
      payload: { message: 'Your property dispute case has been updated by your advocate.' }, // Changed from body to payload
      isRead: false
    },
    {
      user: { connect: { id: studentUser.id } },
      type: 'Course Progress',
      payload: { message: 'You have completed 25% of the Introduction to Indian Legal System course.' }, // Changed from body to payload
      isRead: false
    },
    {
      user: { connect: { id: advocateUser.id } },
      type: 'New Client Inquiry',
      payload: { message: 'You have received a new inquiry from a potential client.' }, // Changed from body to payload
      isRead: true
    }
  ];

  for (const notificationData of notificationsData) {
    await prisma.notification.create({
      data: notificationData as any // Cast to any to bypass strict type checking for seed script
    });
  }

  // Create sample payment
  await prisma.payment.create({
    data: {
      userId: studentUser.id,
      amount: 2999.00,
      currency: 'INR',
      status: PaymentStatus.COMPLETED,
      metadata: {
        courseId: introLawCourse?.id,
        courseName: 'Introduction to Indian Legal System',
        paymentMethod: 'razorpay'
      }
    }
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('📊 Created:');
  console.log('  - 4 users (admin, advocate, student, client)');
  console.log('  - 2 cases');
  console.log('  - 17 categories');
  console.log('  - 10 templates');
  console.log('  - 3 courses');
  console.log('  - 1 enrollment');
  console.log('  - 3 notifications');
  console.log('  - 1 payment record');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
